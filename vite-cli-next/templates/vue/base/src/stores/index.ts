/**
 * Pinia Store 配置
 * 创建 Pinia 实例并配置插件
 */

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export { store }
