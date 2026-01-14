import { Redis } from '@upstash/redis';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from "zod";

import { loadValidatedEnv } from '../evars/evars-server.config'

export const config = { runtime: 'edge' };

const evars = loadValidatedEnv()

const LIGHTWEIGHT_CONTEXT_EXPANDER = `
1. **Core:** We are Backendery — a digital engineering studio. Custom high-performance software engineering for startups & product teams. Avg team exp: 10+ years  
2. **Services:**  
  - High-Perf Backend: Python/Rust, low-latency APIs, distributed systems, memory safety  
  - AI & LLMOps: Autonomous agents, RAG, vector search, multi-agent orchestration  
  - Intelligent UI: React.js/Next.js, reactive interfaces with AI core features  
  - Automation: Complex workflow orchestration, legacy-to-cloud integration  
3. **Tech Stack:** Python, Rust, TypeScript, JavaScript; FastAPI, Axum, React.js, Next.js; PostgreSQL, Redis, Vector DBs (Pinecone or Milvus), OpenAI, LLMs; Docker, K6  
4. **Team:** Iaroslav (CTO), Maxym (CBO), Oleh (CDO)  
5. **Contacts:** hi@backendery.digital  
`;

const INTENT_PROMPT = `
# Backendery AI Assistant  

Classify the user's message intent based on the system capabilities  

## Definitions  
1. **greeting:** Hello, what's up, small talk, pleasantries  
2. **general_inquiry:** Questions covered by the standard studio overview (Services, Tech Stack, Contacts, "Who are you?", "What do you do?", etc.)  
3. **case_study_search:** Deep dives requiring specific details from past projects or complex implementation details **NOT** in the general overview  
4. **out_of_scope:** Unrelated to the studio (weather, politics, personal questions, spam, etc.)  

## Output Rules and Constraints  
1. Automatically detect the user's language and reply in it  
2. **For "greeting"**: Set intent to "greeting" **AND** write a polite, professional welcome message in the 'answer' field  
3. **For "out_of_scope"**: Set intent to "out_of_scope" **AND** write a polite refusal in the 'answer' field (e.g., "I can only discuss Backendery ...")  
4. **For "general_inquiry" or "case_study_search"**: Set the intent **ONLY**. Leave the 'answer' field as an *empty string*
`;

const ANSWER_PROMPT = `
# Backendery AI Assistant  

You are an AI assistant for a **Software Development** studio website  

## System Context  
${LIGHTWEIGHT_CONTEXT_EXPANDER}

## System Mission  
1. Answer questions about services, expertise, and tech stack using "System Context"  
2. If "System Context" is insufficient, use "Knowledge Base" (**file_search**) if available  

## Output Rules and Constraints  
### Tone  
1. Be professional and direct, concise, technical, and factual  
2. **NO** emojis, **NO** sales fluff  

### Strict Output Format  
1. Automatically detect the user's language and reply in it  
2. If the answer is **NOT** present in "System Context" or "Knowledge Base", say: "I don't have that information"
`;

const MAX_USER_PROMPT_LENGTH = 96;
const MAX_NUM_SEARCH_RESULTS =  2;
const RATE_LIMIT = {
  light: { window: 150, max: 10 }, // requests per window per IP in seconds (- RAG)
  rag:   { window: 300, max:  5 }, // requests per window per IP in seconds (+ RAG)
} as const;

const RateLimit = { Light: 'light', Rag: 'rag'} as const;
// annotation
type RateLimit = (typeof RateLimit)[keyof typeof RateLimit];

const Intent = {
  Greeting: 'greeting',
  GeneralInquiry: 'general_inquiry',
  CaseStudySearch: 'case_study_search',
  OutOfScope: 'out_of_scope'
} as const;
// annotation
type Intent = (typeof Intent)[keyof typeof Intent];

const IntentSchema = z.object({
  answer: z.string().default("").describe("Populated ONLY for greeting or out_of_scope. Empty string otherwise."),
  intent: z.enum(Intent),
});

const AnswerSchema = z.object({
  answer: z.string(),
});

const openai = new OpenAI({ apiKey: evars.OPENAI_API_KEY });
const redis = Redis.fromEnv();

async function hashUserAgent(userAgent) {
  if (!userAgent) return '';

  const encoder = new TextEncoder();
  const data = encoder.encode(userAgent);

  // SHA-256 - optimal balance between speed and collisions
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Fastest possible conversion of buffer to hex
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((x) => x.toString(16).padStart(2, '0')).join('');
}

async function getFingerprint(rq: Request) {
  const ip = rq.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const ua = rq.headers.get('user-agent') ?? 'unknown';

  const ipFold = ip.replace('.', '')
  const uaHash = await hashUserAgent(ua)

  return `${ipFold}:${uaHash}`;
}

async function rateLimit(fingerprint: string, rateLimitMode: RateLimit) {
  const { window, max } = RATE_LIMIT[rateLimitMode];
  const key = `ratelimit:${rateLimitMode}:${fingerprint}`;

  const current = Number(await redis.get(key) ?? 0);

  if (current >= max) {
    return false;
  }

  if (current === 0) {
    await redis.setex(key, window, "1");
  } else {
    await redis.incr(key);
  }

  return true;
}

export default async function handler(rq: Request) {
  if (rq.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method Not Allowed' }),
      { status: 405 }
    );
  }

  const { userPrompt } = await rq.json();

  if (typeof userPrompt !== 'string' || userPrompt.length > MAX_USER_PROMPT_LENGTH) {
    return new Response(
      JSON.stringify({ error: 'Invalid prompt' }),
      { status: 400 }
    );
  }

  const fingerprint = await getFingerprint(rq);

  const intentResponse = await openai.responses.parse({
    model: evars.OPENAI_MODEL,
    input: [
      { role: 'system', content: INTENT_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    reasoning: { effort: 'low' },
    text: {
      format: zodTextFormat(IntentSchema, 'intent'),
      verbosity: 'low',
    },
  });

  const { answer: fastAnswer, intent } = intentResponse.output_parsed ?? {};

  /**
   * FAST EXIT PATH (Greeting / OutOfScope)
   * If the classifier has already generated a response, we return it immediately.
   * We save the call to the second model.
   */
  if (fastAnswer && (intent === Intent.Greeting || intent === Intent.OutOfScope)) {
    // Checking the limit for light requests
    if (!await rateLimit(fingerprint, RateLimit.Light)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
    }

    return Response.json({ answer: fastAnswer, intent: intent });
  }

  // Logic remains strict: RAG is ONLY for specific fact queries
  const isUseRAG = intent === Intent.CaseStudySearch;

  /**
   * DEEP PATH (General Inquiry / Case Studies)
   */
  if (!await rateLimit(fingerprint, isUseRAG ? RateLimit.Rag : RateLimit.Light)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
  }

  const answerResponse = await openai.responses.parse({
    model: evars.OPENAI_MODEL, // 'gpt-5-nano'
    input: [
      { role: 'system', content: ANSWER_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    prompt_cache_key: "backendery-ask-ai-v3",
    reasoning: { effort: "low" },
    store: true,
    tools: isUseRAG
      ? [
          {
            type: 'file_search',
            vector_store_ids: [evars.OPENAI_VECTOR_STORE_ID],
            max_num_results: MAX_NUM_SEARCH_RESULTS,
          }
        ]
      : undefined,
    text: { format: zodTextFormat(AnswerSchema, 'answer'), verbosity: "low" }
  });

  const { answer } = answerResponse.output_parsed ?? {};

  return Response.json({ answer: answer });
}
