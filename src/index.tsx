import './index.scss';
/* eslint-disable import/no-unassigned-import */
// This import MUST come first to initialize Sentry early
import './sentry.client.config';
/* eslint-enable import/no-unassigned-import */
import { type FallbackRender } from '@sentry/react';
import * as Sentry from '@sentry/react';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import InternalServerError from '~/containers/errors/InternalServerError/InternalServerError';

import App from './App';

// Wrapper for displaying errors with Sentry integration
// Wraps InternalServerError and adds error reset + page reload logic
const ErrorBoundaryFallback: FallbackRender = ({ error, resetError }) => {
  const handleReset = () => {
    resetError(); // Clears the ErrorBoundary state in Sentry
    window.location.reload();
  };

  return <InternalServerError error={error as Error} resetErrorBoundary={handleReset} />;
};

const isDevelopment = import.meta.env.DEV as boolean;
const app = (
  <Sentry.ErrorBoundary
    // Adding additional context before sending the error to Sentry
    beforeCapture={(scope) => {
      scope.setTag('location', 'root-boundary');
      scope.setLevel('error');
    }}
    fallback={ErrorBoundaryFallback}
    showDialog={!isDevelopment} // Show Sentry feedback dialog only in production
    >
    {isDevelopment ? (
      // In dev mode, use StrictMode for additional React checks
      <StrictMode>
        <App />
      </StrictMode>
    ) : (
      // In production, StrictMode is disabled for performance
      <App />
    )}
  </Sentry.ErrorBoundary>
);
const rootElement = document.querySelector('#root') as HTMLDivElement;

createRoot(rootElement, {
  // Callback called when an error is thrown and not caught by an Error Boundary.
  onUncaughtError: Sentry.reactErrorHandler((error: any, errorInfo: React.ErrorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(app);
