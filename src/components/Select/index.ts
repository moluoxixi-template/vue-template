import Select from '@moluoxixi/select'
import type { App } from 'vue'

// 导出组件
export default Select

// 用于Vue插件形式注册
export function install(app: App) {
  app.component('Select', Select)
}
