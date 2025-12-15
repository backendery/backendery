import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

// Enable debug mode for all environments except production
// Allows seeing Sentry logs in the console during development
const debug = import.meta.env.VITE_APP_MODE !== 'production';

// Get the DSN (Data Source Name) from environment variables
// DSN is a unique URL for sending events to a specific Sentry project
const dsn = import.meta.env.VITE_SENTRY_DSN ?? '';
// Check DSN validity: not empty and does not contain the placeholder from the example
// The fake DSN from .env.example should not initialize Sentry
const isValidDsn = dsn.length > 0 && !dsn.includes('examplePublicKey');

// Sentry is only active in production and only with a valid DSN
// In dev/staging, Sentry is initialized but does not send events (enabled: false)
const enabled = !debug && isValidDsn;

Sentry.init({
  // Maximum data for errors
  // More context: user action chain (clicks, XHR, console), deep objects in extra/context, etc.
  attachStacktrace: import.meta.env.VITE_SENTRY_ATTACH_STACKTRACE,
  debug,
  dsn,

  enabled,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,

  // Maximum signals on the frontend
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      createRoutesFromChildren,
      matchRoutes,
      useEffect,
      useLocation,
      useNavigationType,
    }),
    Sentry.zodErrorsIntegration(),
    Sentry.browserTracingIntegration({
      shouldCreateSpanForRequest(url) {
        // Only our API requests
        return url.startsWith(import.meta.env.VITE_LETS_START_FORM_API_ORIGIN);
      },
    }),
    Sentry.replayIntegration(),
  ],

  maxBreadcrumbs: import.meta.env.VITE_SENTRY_MAX_BREADCRUMBS,
  normalizeDepth: import.meta.env.VITE_SENTRY_NORMALIZE_DEPTH, // Deeper unfolding of objects in event,

  // Performance/Tracing (free-plan also gives them, but with limits)
  //  - send everything (until we hit project limits)
  //  - if `overquota` errors start occurring, lower to 0.5 / 0.2
  profilesSampleRate: import.meta.env.VITE_SENTRY_PROFILES_SAMPLE_RATE,
  release: import.meta.env.VITE_SENTRY_RELEASE,

  // Replays with a bias towards errors
  //  - every crash/error means a session with video
  //  - only 10% of regular sessions, to avoid wasting quotas
  replaysOnErrorSampleRate: import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  replaysSessionSampleRate: import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,

  sendDefaultPii: import.meta.env.VITE_SENTRY_SEND_DEFAULT_PII,
  tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
});
