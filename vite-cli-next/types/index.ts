/**
 * CLI 类型定义
 */

export type Framework = 'vue' | 'react'

export type UILibrary = 'elementPlus' | 'antDesignVue' | 'antDesign'

export type RouteMode = 'fileSystem' | 'manual'

export type PackageManager = 'pnpm' | 'npm' | 'yarn'

export interface ProjectConfig {
  projectName: string
  description: string
  author: string
  framework: Framework
  uiLibrary: UILibrary
  routeMode: RouteMode
  i18n: boolean
  qiankun: boolean
  sentry: boolean
  packageManager: PackageManager
  targetDir: string
}

export type LayerType = 'common' | 'base' | 'feature'

export interface LayerConfig {
  type: LayerType
  path: string
  name: string
}

export interface FeatureConfig {
  name: string
  path: string
  enabled: boolean
}
