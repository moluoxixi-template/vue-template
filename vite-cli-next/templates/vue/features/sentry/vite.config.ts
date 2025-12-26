/**
 * Sentry Vite 配置扩展
 */

import type { ViteConfigExtension } from '../../../src/types'

const config: ViteConfigExtension = {
  imports: [
    ['sentryVitePlugin', '@sentry/vite-plugin'],
  ],
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
}

export default config
