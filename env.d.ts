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
  /**
   * Sentry DSN（仅在 .env.production 中配置，用于生产环境错误监控）
   */
  VITE_SENTRY?: string
  /**
   * 应用版本号（用于 Sentry 追踪问题版本，默认值 unknown）
   */
  VITE_APP_VERSION?: string
}

declare const __SYSTEM_CODE__ = string

declare global {

}
