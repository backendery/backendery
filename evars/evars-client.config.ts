import { loadEnv } from 'vite';
import { z } from 'zod';

const AppMode = { Development: 'development', Production: 'production' } as const;

type AppMode = (typeof AppMode)[keyof typeof AppMode];

// Defines the schema for environment variable validation. Uses `Zod` for schema
// validation and type inference
const evarsSchema = z.object({
  // Application variables
  VITE_APP_ORIGIN: z.url(),
  VITE_APP_MODE: z.enum(AppMode).default(AppMode.Development),

  // GTM variables
  VITE_GTM_ID: z.string().regex(/^GTM-[A-Z0-9]{1,8}$/, 'GTM ID must have the format GTM-XXXXXXXX'),

  // API variables
  VITE_LETS_START_FORM_API_ORIGIN: z.url(),

  // Monitoring variables
  VITE_SENTRY_ATTACH_STACKTRACE: z.coerce.boolean(),
  VITE_SENTRY_DSN: z.url(),
  VITE_SENTRY_ENVIRONMENT: z.enum(AppMode).default(AppMode.Development),
  VITE_SENTRY_MAX_BREADCRUMBS: z.coerce.number().min(0).max(100),
  VITE_SENTRY_NORMALIZE_DEPTH: z.coerce.number().min(0).max(10),
  VITE_SENTRY_PROFILES_SAMPLE_RATE: z.coerce.number().min(0).max(1),
  VITE_SENTRY_RELEASE: z.string(),
  VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE: z.coerce.number().min(0).max(1),
  VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE: z.coerce.number().min(0).max(1),
  VITE_SENTRY_SEND_DEFAULT_PII: z.coerce.boolean(),
  VITE_SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1),
});

/**
 * Load and validate environment variables based on the provided mode.
 *
 * @param {string} mode The mode for which to load the environment variables.
 * @returns {EvarsSchema} The validated environment variables.
 */
const loadValidatedEnv = (mode: string): EvarsSchema => {
  const rawEnv = loadEnv(mode, process.cwd(), 'VITE_');

  // Parses and validates environment variables. Throws an error if any required variable
  // is missing or invalid.
  const parsed = evarsSchema.safeParse(rawEnv);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error);
    throw new Error('Failed to load environment variables');
  }

  return parsed.data;
};

export type EvarsSchema = z.infer<typeof evarsSchema>;

export { loadValidatedEnv };
