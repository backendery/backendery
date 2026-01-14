import OpenAI from 'openai';
import { loadValidatedEnv } from '../evars/evars-server.config'

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `
# Backendery AI Assistant  

You are an AI assistant for a **Software Development** studio website.  

## System Mission  
1. Answer questions about services, expertise, processes, what we do, and what we use.  
2. Be concise, technical, and factual.  
3. Prefer concrete examples over marketing language.  
4. If information is not available in the knowledge base, say so.  

## Output Format and Constraints  
### Tone  
1. Professional.  
2. Direct.  
3. No emojis.  
4. No sales fluff.  

### Strict Output Format  
1. Automatically detect the language from the user's message.  
2. All technical fields (e.g., JSON keys) **MUST** be in English.  
3. Populate **ALL** natural-language fields using the detected user language.  
4. If the answer is not present in the provided documents, say: "I don't have that information."  

## Out-of-Scope  
Messages are **out of scope** if they are:  
1. Unrelated to the studio or it's services (e.g., "What's the weather?", "What time is it in London?").  
2. Nonsensical or spam.
`;

const evars = loadValidatedEnv()

const openai = new OpenAI({
  apiKey: evars.OPENAI_API_KEY,
});

export default async function handler(rq: Request) {
  if (rq.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { userPrompt } = await rq.json();

  const response = await openai.responses.create({
    model: evars.OPENAI_MODEL, // 'gpt-5-nano'
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    prompt_cache_key: "backendery-ask-ai-v1",
    tools: [
      {
        type: 'file_search',
        vector_store_ids: [evars.OPENAI_VECTOR_STORE_ID],
      },
    ],
    text: { verbosity: "medium" }
  });

  return Response.json({
    answer: response.output_text,
  });
}
