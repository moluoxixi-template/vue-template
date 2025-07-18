import viteConfig, { wrapperEnv } from '@moluoxixi/viteconfig'
import path from 'node:path'
import process from 'node:process'
import type { UserConfig } from 'vite'
import { loadEnv } from 'vite'
// sentry
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default viteConfig({
  rootPath: path.resolve(),
  mode: {
    base: {
      VITE_AUTO_ROUTES: true,
      VITE_GLOB_APP_TITLE: 'test',
      VITE_GLOB_APP_CODE: 'test',
      VITE_DEVTOOLS: false,
      VITE_PURE_CONSOLE_AND_DEBUGGER: false,
      VITE_PORT: 3300,
      VITE_OPEN: true,
      VITE_USE_QIANKUN: true,
      VITE_QIANKUN_DEV: false,
      VITE_COMPRESS: true,
      VITE_IMAGEMIN: true,
      VITE_BUILD_GZIP: true,
    },
    development: {},
    production: {},
  },
  viteConfig: ({ mode }: UserConfig) => {
    const env = loadEnv(mode!, process.cwd())
    const viteEnv = wrapperEnv(env)
    return {
      plugins: [
        viteEnv.VITE_SENTRY
        && sentryVitePlugin({
          authToken: process.env.SENTRY_AUTH_TOKEN,
          org: 'f1f562b9b82f',
          project: 'javascript-vue',
        }),
      ],
      server: {
        proxy: {
          '/ts-bs-his-base': {
            target: `${viteEnv.VITE_PROXY_URL}`,
            secure: false,
            changeOrigin: true,
            configure: (proxy: any) => {
              const encryptedList = ['appId', 'randomStr', 'timestamp', 'version', 'sign']
              proxy.on('proxyReq', (proxyReq: any, req: any) => {
                encryptedList.forEach((item) => {
                  proxyReq.setHeader(item, req.headers[item.toLocaleLowerCase()] || req.headers[item])
                })
              })
            },
          },
        },
      },
    }
  },
})
