/**
 * Sentry 错误监控
 * 初始化 Sentry 配置
 */

import * as Sentry from '@sentry/react'

/**
 * 初始化 Sentry
 */
export function initSentry(): void {
  if (import.meta.env.VITE_SENTRY && import.meta.env.MODE === 'production') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      integrations: [
        Sentry.browserTracingIntegration(),
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
