/**
 * Sentry Feature - vite.config.ts 配置片段
 * 文件路径对应生成的文件：vite.config.ts
 */

import type { VitePluginDeclaration } from '../../core/orchestrator/types.ts'

export const plugins: VitePluginDeclaration[] = [
  {
    name: 'sentry',
    import: {
      from: '@sentry/vite-plugin',
      named: ['sentryVitePlugin'],
      priority: 100,
    },
    instantiate: `viteEnv.VITE_SENTRY && mode === 'production' && sentryVitePlugin({
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
    order: 10,
  },
]
