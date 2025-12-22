/**
 * 布局组件自动导入
 * 根据 layouts 目录结构自动注册布局组件
 */

import type { App, Component } from 'vue'

type LayoutsMap = Record<string, Component>

// 自动导入 layouts 目录下的所有 .vue 文件
const layoutFiles = import.meta.glob('./*.vue', { eager: true, import: 'default' })
const layouts = Object.keys(layoutFiles).reduce<LayoutsMap>((modules, modulePath) => {
  const nameArr: string[] = modulePath.split('/')
  const name: string | undefined
    = nameArr.at(-1) === 'index.vue' ? nameArr.at(-2) : nameArr.at(-1)?.slice(0, -4)
  const layout: Component = layoutFiles[modulePath] as Component
  if (!layout)
    return modules
  if (name) {
    modules[name!] = layout as Component
  }
  return modules
}, {})

/**
 * 安装布局组件
 * @param app Vue 应用实例
 */
const layoutsWithInstall = layouts as LayoutsMap & { install: (app: App) => void }
layoutsWithInstall.install = function (app: App) {
  const layoutNames = Object.keys(layouts)
  layoutNames.forEach((name) => {
    app.component(name, layouts[name!])
  })
}

export default layoutsWithInstall
