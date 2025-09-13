import type { App, Component } from 'vue'

export {}

const components: Component[] = []

export default {
  install(app: App) {
    components.forEach((component) => {
      const name: string | undefined = (component as any)?.name
      if (!name) {
        console.warn('[withInstall] 组件缺少 name，已跳过注册。')
      }
      else {
        console.log(` 组件${name}，已注册。`)
        app.component(name, component)
      }
    })
  },
}
