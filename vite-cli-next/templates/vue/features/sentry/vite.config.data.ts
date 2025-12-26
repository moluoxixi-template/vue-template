/**
 * Sentry 特性 - Vite 配置数据
 */

import type { ViteConfigDataType } from '../../../src/types';

/**
 * 获取 Sentry Vite 配置
 */
export function getSentryViteConfig(): ViteConfigDataType {
  return {
    imports: [['sentryVitePlugin', '@sentry/vite-plugin']],
    plugins: [
      `viteEnv.VITE_SENTRY && mode === 'production' && sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'f1f562b9b82f',
        project: 'javascript-vue',
        sourcemaps: {
          assets: './dist/**',
          ignore: ['node_modules'],
        },
        release: {
          name: viteEnv.VITE_APP_VERSION || 'unknown',
        },
      })`,
    ],
    config: {},
  };
}

