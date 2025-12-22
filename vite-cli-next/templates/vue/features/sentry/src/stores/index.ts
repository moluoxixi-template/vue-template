/**
 * Pinia Store 配置
 * 创建 Pinia 实例并配置插件
 */

import { createSentryPiniaPlugin } from '@sentry/vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

// 只在启用 Sentry 时使用 Pinia 插件（用于跟踪错误时的状态）
if (import.meta.env.VITE_SENTRY) {
  store.use(createSentryPiniaPlugin())
}

export { store }
