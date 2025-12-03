// 配置文件
import path from 'node:path'
import process from 'node:process'
import cssModuleGlobalRootPlugin from '@moluoxixi/cssmoduleglobalrootplugin'
import { ViteConfig, wrapperEnv } from '@moluoxixi/viteconfig'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { loadEnv } from 'vite'

export default ViteConfig(
  ({ mode }) => {
    const env = loadEnv(mode!, process.cwd())
    const viteEnv = wrapperEnv(env)
    const rootPath = path.resolve()
    const appCode = viteEnv.VITE_APP_CODE
    const appTitle = viteEnv.VITE_APP_TITLE
    const port = viteEnv.VITE_APP_PORT
    return {
      rootPath,
      appTitle,
      appCode,
      port,
      autoComponent: true,
      autoRoutes: true,
      viteConfig: {
        plugins: [
          // Sentry Source Map 上传插件（仅在生产环境且配置了 VITE_SENTRY 时启用）
          viteEnv.VITE_SENTRY
          && mode === 'production'
          && sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'f1f562b9b82f',
            project: 'javascript-vue',
            // 仅上传 source map，不上传源码
            sourcemaps: {
              assets: './dist/**',
              ignore: ['node_modules'],
            },
            // 设置发布版本
            release: {
              name: viteEnv.VITE_APP_VERSION || 'unknown',
            },
          }),
        ],
        server: {
          proxy: {
            '/ts-bs-his-base': {
              changeOrigin: true,
              target: 'http://192.168.209.103:9099',
            },
          },
        },
        css: {
          postcss: {
            plugins: [
              cssModuleGlobalRootPlugin(),
            ],
          },
          preprocessorOptions: {
            scss: {
              silenceDeprecations: ['legacy-js-api'],
              api: 'modern-compiler',
              additionalData: (source: string, filename: string) => {
                if (filename.includes('assets/styles/element/index.scss')) {
                  return `$namespace : 'el';
                ${source}`
                }
                else {
                  return source
                }
              },
            },
          },
        },
      },
    }
  },
)
