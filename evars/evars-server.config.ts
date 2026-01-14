import { z } from 'zod';

const AppMode = { Development: 'development', Production: 'production', Preview: 'preview' } as const;

type AppMode = (typeof AppMode)[keyof typeof AppMode];

// Defines the schema for environment variable validation. Uses `Zod` for schema
// validation and type inference
const evarsSchema = z.object({
  // OpenAI
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string(),
  OPENAI_VECTOR_STORE_ID: z.string(),
  VERCEL_ENV: z.enum(AppMode).optional(),
});

/**
 * Load and validate environment variables based on the provided mode.
 *
 * @param {string} mode The mode for which to load the environment variables.
 * @returns {EvarsSchema} The validated environment variables.
 */
const loadValidatedEnv = (): EvarsSchema => {
  // Parses and validates environment variables. Throws an error if any required variable
  // is missing or invalid.
  const parsed = evarsSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error);
    throw new Error('Failed to load environment variables');
  }

  return parsed.data;
};

export type EvarsSchema = z.infer<typeof evarsSchema>;

export { loadValidatedEnv };
