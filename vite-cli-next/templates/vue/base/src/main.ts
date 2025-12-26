/**
 * 应用入口文件
 * 初始化 Vue 应用并挂载到 DOM
 */

import { createApp } from 'vue'
import directives from '@/directives'
import { store } from '@/stores'
import App from './App.vue'
import getRouter from './router'

// 导入样式文件
import '@/assets/styles/main.scss'
import '@/assets/fonts/index.css'

const app = createApp(App)

// 注册指令
directives(app)

const router = getRouter({})

app.use(store)
app.use(router)
app.config.warnHandler = () => null

app.mount('#app')
