import EnterNextDragTable from './src/index.ts'
import type { App } from 'vue'

// 导出组件
export default EnterNextDragTable

// 用于Vue插件形式注册
export function install(app: App) {
  app.component('EnterNextDragTable', EnterNextDragTable)
}
