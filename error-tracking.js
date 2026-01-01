/**
 * Error Tracking Configuration
 *
 * This file sets up error tracking for the VizAI application.
 * Currently configured for Sentry, but can be adapted for other services.
 *
 * Setup Instructions:
 * 1. Sign up at https://sentry.io
 * 2. Create a new project
 * 3. Copy your DSN from the project settings
 * 4. Replace SENTRY_DSN below with your actual DSN
 * 5. Uncomment the Sentry script in index.html and scan.html
 */

// Initialize error tracking
function initErrorTracking() {
  // Only initialize in production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[Error Tracking] Disabled in development mode');
    return;
  }

  // Check if Sentry is loaded
  if (typeof Sentry === 'undefined') {
    console.warn('[Error Tracking] Sentry SDK not loaded');
    return;
  }

  try {
    // Initialize Sentry
    Sentry.init({
      // TODO: Replace with your actual Sentry DSN
      dsn: "YOUR_SENTRY_DSN_HERE",

      // Environment
      environment: window.location.hostname.includes('staging') ? 'staging' : 'production',

      // Release tracking (update this with each deployment)
      release: "vizai@1.0.0",

      // Sample rate (100% = all errors, 50% = half)
      tracesSampleRate: 1.0,

      // Performance monitoring
      integrations: [
        new Sentry.BrowserTracing({
          tracePropagationTargets: ["localhost", "vizai.app", /^\//],
        }),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Session Replay sample rate
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Filter sensitive data
      beforeSend(event, hint) {
        // Remove sensitive data from event
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers;
        }

        // Don't send events with specific error messages
        const errorMessage = hint.originalException?.message || '';
        if (errorMessage.includes('password') || errorMessage.includes('token')) {
          return null;
        }

        return event;
      },
    });

    console.log('[Error Tracking] Sentry initialized');

    // Set user context (optional - set after user logs in)
    // Sentry.setUser({
    //   id: "user-id",
    //   email: "user@example.com",
    // });

  } catch (error) {
    console.error('[Error Tracking] Failed to initialize:', error);
  }
}

// Global error handler wrapper
window.trackError = function(error, context = {}) {
  if (typeof Sentry !== 'undefined' && Sentry.captureException) {
    Sentry.captureException(error, {
      extra: context
    });
  } else {
    console.error('[Error]', error, context);
  }
};

// Global message tracker
window.trackMessage = function(message, level = 'info') {
  if (typeof Sentry !== 'undefined' && Sentry.captureMessage) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level.toUpperCase()}]`, message);
  }
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initErrorTracking);
} else {
  initErrorTracking();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initErrorTracking };
}
