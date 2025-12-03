import type { App } from 'vue'
import type { Router } from 'vue-router'
import { browserTracingIntegration, init, replayCanvasIntegration, replayIntegration, setUser, vueIntegration } from '@sentry/vue'

/**
 * 需要过滤的错误消息关键词（浏览器扩展、网络错误等）
 */
const FILTERED_ERROR_MESSAGES = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'Non-Error promise rejection captured',
  'NetworkError',
  'Failed to fetch',
  'Network request failed',
]

/**
 * 需要过滤的异常值关键词（第三方库常见错误）
 */
const FILTERED_EXCEPTION_VALUES = [
  'ResizeObserver loop limit exceeded',
  'Script error',
]

/**
 * 敏感信息关键词（用于过滤面包屑）
 */
const SENSITIVE_KEYWORDS = ['password', 'token', 'secret', 'key', 'auth']

/**
 * 初始化 Sentry 配置
 * 符合生产环境标准的最佳实践
 *
 * 启用规则：
 * - 仅在 .env.production 中配置 VITE_SENTRY（DSN）即可
 * - 开发环境不配置则不启用
 */
export function initSentry(app: App, router: Router) {
  const dsn = import.meta.env.VITE_SENTRY

  // 只在配置了 DSN 时启用（通常只在生产环境配置）
  if (!dsn) {
    return
  }

  const isProduction = import.meta.env.MODE === 'production'

  init({
    app,
    dsn,

    // 环境标识
    environment: import.meta.env.MODE || 'development',

    // 发布版本（用于追踪问题版本）
    release: import.meta.env.VITE_APP_VERSION || 'unknown',

    // 采样率配置
    tracesSampleRate: isProduction ? 0.1 : 1.0, // 生产环境采样 10%，开发环境 100%

    // 会话录制采样率
    replaysSessionSampleRate: isProduction ? 0.01 : 0.1, // 生产环境 1%，开发环境 10%
    replaysOnErrorSampleRate: 1.0, // 错误时 100% 录制

    // 数据规范化深度（防止过深的对象导致性能问题）
    normalizeDepth: 5,

    // 是否发送默认 PII（个人身份信息）
    sendDefaultPii: false, // 生产环境建议关闭，保护用户隐私

    // 最大面包屑数量
    maxBreadcrumbs: 50,

    // 错误过滤 - 过滤掉一些已知的、不重要的错误
    beforeSend(event, hint) {
      // 过滤错误消息
      if (event.exception) {
        const error = hint.originalException
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message)

          // 检查是否匹配需要过滤的错误消息
          if (FILTERED_ERROR_MESSAGES.some(keyword => message.includes(keyword))) {
            return null
          }
        }
      }

      // 过滤异常值
      if (event.exception?.values) {
        for (const exception of event.exception.values) {
          if (exception.value) {
            // 检查是否匹配需要过滤的异常值
            if (FILTERED_EXCEPTION_VALUES.some(keyword => exception.value?.includes(keyword))) {
              return null
            }
          }
        }
      }

      return event
    },

    // 面包屑过滤 - 过滤敏感信息
    beforeBreadcrumb(breadcrumb) {
      // 过滤掉包含敏感信息的控制台日志
      if (breadcrumb.category === 'console') {
        const message = breadcrumb.message || ''

        if (SENSITIVE_KEYWORDS.some(keyword => message.toLowerCase().includes(keyword))) {
          return null
        }
      }

      // 过滤掉包含敏感信息的网络请求
      if (breadcrumb.category === 'fetch' || breadcrumb.category === 'xhr') {
        const url = breadcrumb.data?.url || ''

        // 检查 URL 中是否包含敏感关键词
        if (SENSITIVE_KEYWORDS.some(keyword => url.includes(keyword))) {
          // 可以保留但脱敏
          if (breadcrumb.data) {
            const regex = new RegExp(`(${SENSITIVE_KEYWORDS.join('|')})=[^&]*`, 'gi')
            breadcrumb.data.url = url.replace(regex, '$1=***')
          }
        }
      }

      return breadcrumb
    },

    integrations: [
      // Vue 集成（基础错误捕获，不启用性能跟踪）
      vueIntegration(),

      // 浏览器性能跟踪（生产环境启用，开发环境可选）
      ...(isProduction
        ? [
            browserTracingIntegration({
              router,
            }),
          ]
        : []),

      // 会话录制
      replayIntegration({
        // 屏蔽敏感元素
        maskAllText: false, // 不屏蔽所有文本，只屏蔽输入框
        maskAllInputs: true, // 屏蔽所有输入框
        blockAllMedia: false, // 不屏蔽媒体，但可以配置
      }),

      // Canvas 录制（如果应用中有 Canvas）
      replayCanvasIntegration(),
    ],

    // 初始作用域配置
    // 这些标签和上下文信息会被附加到所有捕获的事件中
    initialScope: {
      tags: {
        component: 'vue-app',
        environment: import.meta.env.MODE || 'development', // 环境标识（development/staging/production）
        appCode: import.meta.env.VITE_APP_CODE || 'unknown',
        appTitle: import.meta.env.VITE_APP_TITLE, // 默认值已在环境变量配置中处理
      },
      contexts: {
        app: {
          app_name: import.meta.env.VITE_APP_TITLE, // 默认值已在环境变量配置中处理
          app_version: import.meta.env.VITE_APP_VERSION || 'unknown', // 应用版本号
        },
      },
    },
  })
}

/**
 * 设置 Sentry 用户信息
 * 在用户登录后调用
 */
export function setSentryUser(userInfo: {
  id?: string
  username?: string
  email?: string
  [key: string]: any
}) {
  if (!import.meta.env.VITE_SENTRY) {
    return
  }

  setUser({
    id: userInfo.id,
    username: userInfo.username,
    email: userInfo.email,
    // 不要传递敏感信息，如密码、token 等
  })
}

/**
 * 清除 Sentry 用户信息
 * 在用户登出时调用
 */
export function clearSentryUser() {
  if (!import.meta.env.VITE_SENTRY) {
    return
  }

  setUser(null)
}
