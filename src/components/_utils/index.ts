import type { App, Component } from 'vue'

export type WithInstall<T extends Component> = T & {
  install: (app: App, options?: unknown) => void
}
export function withInstall<T extends Component>(component: T): WithInstall<T> {
  (component as any).install = (app: App, _options?: unknown) => {
    const name: string | undefined = (component as any)?.name
    if (!name) {
      console.warn('[withInstall] 组件缺少 name，已跳过注册。')
    }
    else {
      console.log('🚀 注册组件:', component.name)
      app.component(name, component as any)
    }
  }
  return component as WithInstall<T>
}
