import viteConfig, { wrapperEnv } from '@moluoxixi/viteconfig'
import path from 'node:path'
import process from 'node:process'
import { loadEnv } from 'vite'
// sentry

export default viteConfig(
  ({ mode }) => {
    const env = loadEnv(mode!, process.cwd())
    const viteEnv = wrapperEnv(env)
    return {
      rootPath: path.resolve(),
      mode: {
        base: {
          VITE_AUTO_ROUTES: true,
          VITE_GLOB_APP_TITLE: viteEnv.VITE_GLOB_APP_TITLE,
          VITE_GLOB_APP_CODE: viteEnv.VITE_GLOB_APP_CODE,
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
      viteConfig: {
        plugins: [
        //   一些插件
        ],
        server: {
          proxy: {
          //   用户代理
          },
        },
      },
    }
  },
)
