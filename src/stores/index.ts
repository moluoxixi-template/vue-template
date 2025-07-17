import { createSentryPiniaPlugin } from '@sentry/vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const store = createPinia()
store.use(piniaPluginPersistedstate)
store.use(createSentryPiniaPlugin())
export { store }
