/// <reference types="vite/client" />
declare interface ViteEnv {
  /**
   * 项目标题
   */
  VITE_APP_TITLE: string
  /**
   * 项目code
   */
  VITE_APP_CODE: string
  /**
   * 项目端口
   */
  VITE_APP_PORT: number
  VITE_PROXY_URL: string
}

declare const __SYSTEM_CODE__: string

declare global {

}
