/**
 * Sentry 错误监控
 * 初始化和配置 Sentry
 */

import type { App } from 'vue'
import type { Router } from 'vue-router'
import * as Sentry from '@sentry/vue'

/**
 * 初始化 Sentry
 */
export function initSentry(app: App, router: Router): void {
  if (import.meta.env.VITE_SENTRY && import.meta.env.MODE === 'production') {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      integrations: [
        Sentry.browserTracingIntegration({ router }),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
      environment: import.meta.env.VITE_APP_ENV || 'production',
    })
  }
}
