/**
 * 配置合并工具
 * package.json 和 pnpm-workspace.yaml 的深度合并
 */

import type { PackageJsonType, PnpmWorkspaceType, ProjectConfigType } from '../types'
import path from 'node:path'
import { merge } from 'lodash-es'
import YAML from 'yaml'
import { getTemplatesDir, pathExists, readFile, readJsonFile } from './file'

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  return merge({}, target, ...sources)
}

/**
 * 按字母排序对象
 */
export function sortObject<T>(obj: Record<string, T>): Record<string, T> {
  return Object.keys(obj)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = obj[key]
      return sorted
    }, {} as Record<string, T>)
}

/**
 * 获取特性目录列表
 */
export function getFeatureDirs(config: ProjectConfigType): string[] {
  const features: string[] = []
  const framework = config.framework

  // UI 库
  if (framework === 'vue') {
    if (config.uiLibrary === 'element-plus') {
      features.push('element-plus')
    }
    else if (config.uiLibrary === 'ant-design-vue') {
      features.push('ant-design-vue')
    }
  }
  else {
    if (config.uiLibrary === 'ant-design') {
      features.push('ant-design')
    }
  }

  // i18n
  if (config.i18n) {
    features.push('i18n')
  }

  // sentry
  if (config.sentry) {
    features.push('sentry')
  }

  // qiankun (Vue only)
  if (config.qiankun && framework === 'vue') {
    features.push('qiankun')
  }

  // 文件系统路由
  if (config.routeMode === 'file-system') {
    features.push('pageRoutes')
  }

  return features
}

/**
 * 合并 package.json 文件
 * 从 L1 base 和 L2 features 合并
 */
export function mergePackageJson(config: ProjectConfigType): PackageJsonType {
  const templatesDir = getTemplatesDir()
  const framework = config.framework
  const features = getFeatureDirs(config)

  // 读取 L1 base package.json
  const basePath = path.join(templatesDir, framework, 'base', 'package.json')
  let result = readJsonFile<PackageJsonType>(basePath)

  // 更新项目名称和作者
  result.name = config.projectName
  result.author = config.author || ''

  // 合并 L2 features
  for (const feature of features) {
    const featurePath = path.join(templatesDir, framework, 'features', feature, 'package.json')
    if (pathExists(featurePath)) {
      const featurePackage = readJsonFile<Partial<PackageJsonType>>(featurePath)
      result = deepMerge(result, featurePackage)
    }
  }

  // 排序 dependencies
  if (result.dependencies) {
    result.dependencies = sortObject(result.dependencies)
  }
  if (result.devDependencies) {
    result.devDependencies = sortObject(result.devDependencies)
  }

  return result
}

/**
 * 合并 pnpm-workspace.yaml 文件
 * 从 L1 base 和 L2 features 合并
 */
export function mergePnpmWorkspace(config: ProjectConfigType): string {
  const templatesDir = getTemplatesDir()
  const framework = config.framework
  const features = getFeatureDirs(config)

  // 读取 L1 base pnpm-workspace.yaml
  const basePath = path.join(templatesDir, framework, 'base', 'pnpm-workspace.yaml')
  const baseContent = readFile(basePath)
  let result = YAML.parse(baseContent) as PnpmWorkspaceType

  // 合并 L2 features
  for (const feature of features) {
    const featurePath = path.join(templatesDir, framework, 'features', feature, 'pnpm-workspace.yaml')
    if (pathExists(featurePath)) {
      const featureContent = readFile(featurePath)
      const featureWorkspace = YAML.parse(featureContent) as Partial<PnpmWorkspaceType>
      result = deepMerge(result, featureWorkspace)
    }
  }

  // 生成 YAML 字符串
  const header = `# pnpm workspace 配置
# 用于管理项目依赖版本

`
  return header + YAML.stringify(result)
}

/**
 * 合并 vite.config.ts 配置
 * 收集所有 L2 特性的配置扩展
 */
export function getViteConfigExtensions(config: ProjectConfigType): {
  imports: Array<[string, string]>
  plugins: string[]
  configOverrides: Record<string, unknown>
} {
  getFeatureDirs(config)
  const imports: Array<[string, string]> = []
  const plugins: string[] = []
  const configOverrides: Record<string, unknown> = {}

  // 这里可以根据特性动态添加配置
  // 目前通过静态文件实现，后续可以扩展

  // 文件系统路由
  if (config.routeMode === 'file-system') {
    configOverrides.pageRoutes = true
  }

  // Sentry
  if (config.sentry) {
    imports.push(['sentryVitePlugin', '@sentry/vite-plugin'])
    plugins.push(`viteEnv.VITE_SENTRY && mode === 'production' && sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'f1f562b9b82f',
      project: 'javascript-vue',
      sourcemaps: {
        assets: './dist/**',
        ignore: ['node_modules'],
      },
      release: {
        name: viteEnv.VITE_APP_VERSION || 'unknown',
      },
    })`)
  }

  return { imports, plugins, configOverrides }
}

/**
 * 合并 main.ts 配置
 * 收集所有 L2 特性的 main.ts 扩展
 */
export function getMainTsExtensions(config: ProjectConfigType): {
  imports: string[]
  appUse: string[]
  afterRouter: string[]
  beforeMount: string[]
  styleImports: string[]
} {
  const imports: string[] = []
  const appUse: string[] = []
  const afterRouter: string[] = []
  const beforeMount: string[] = []
  const styleImports: string[] = []

  // UI 库样式
  if (config.framework === 'vue') {
    if (config.uiLibrary === 'element-plus') {
      styleImports.push('import \'@/assets/styles/element/index.scss\'')
    }
    else if (config.uiLibrary === 'ant-design-vue') {
      styleImports.push('import \'ant-design-vue/dist/reset.css\'')
    }
  }

  // i18n
  if (config.i18n) {
    if (config.framework === 'vue') {
      imports.push('import i18n from \'@/locales\'')
      appUse.push('app.use(i18n)')
    }
  }

  // Sentry
  if (config.sentry) {
    if (config.framework === 'vue') {
      imports.push('import { initSentry } from \'@/utils/sentry\'')
      afterRouter.push('initSentry(app, router)')
    }
  }

  return { imports, appUse, afterRouter, beforeMount, styleImports }
}
