/**
 * 深度合并工具
 * package.json 和其他配置的深度合并
 */

import type { PackageJsonType, PnpmWorkspaceType, ProjectConfigType } from '../types'
import { merge } from 'lodash-es'

/** @moluoxixi 核心依赖 - 必须存在 */
export const MOLUOXIXI_DEPS = {
  '@moluoxixi/eslint-config': 'latest',
  '@moluoxixi/vite-config': 'latest',
  '@moluoxixi/ajax-package': 'latest',
  '@moluoxixi/class-names': 'latest',
  '@moluoxixi/css-module-global-root-plugin': 'latest',
} as const

/**
 * 深度合并对象
 * @param target 目标对象
 * @param sources 源对象数组
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  return merge({}, target, ...sources)
}

/**
 * 合并 package.json 配置
 * @param base 基础配置
 * @param overrides 覆盖配置数组
 */
export function mergePackageJson(
  base: Partial<PackageJsonType>,
  ...overrides: Partial<PackageJsonType>[]
): PackageJsonType {
  const merged = deepMerge(base as PackageJsonType, ...overrides)

  // 确保 @moluoxixi 依赖存在
  ensureMoluoxixiDeps(merged)

  // 排序 dependencies 和 devDependencies
  if (merged.dependencies) {
    merged.dependencies = sortObject(merged.dependencies)
  }
  if (merged.devDependencies) {
    merged.devDependencies = sortObject(merged.devDependencies)
  }

  return merged
}

/**
 * 确保 @moluoxixi 依赖存在
 * @param packageJson package.json 对象
 */
export function ensureMoluoxixiDeps(packageJson: Partial<PackageJsonType>): void {
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {}
  }

  // 确保核心依赖存在
  packageJson.devDependencies['@moluoxixi/eslint-config'] = 'catalog:dev'
  packageJson.devDependencies['@moluoxixi/vite-config'] = 'catalog:dev'
  packageJson.devDependencies['@moluoxixi/css-module-global-root-plugin'] = 'catalog:dev'

  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }
  packageJson.dependencies['@moluoxixi/ajax-package'] = 'catalog:build'
  packageJson.dependencies['@moluoxixi/class-names'] = 'catalog:build'
}

/**
 * 合并 pnpm-workspace.yaml 配置
 * @param base 基础配置
 * @param overrides 覆盖配置
 */
export function mergePnpmWorkspace(
  base: Partial<PnpmWorkspaceType>,
  ...overrides: Partial<PnpmWorkspaceType>[]
): PnpmWorkspaceType {
  const merged = deepMerge(base as PnpmWorkspaceType, ...overrides)

  // 确保 @moluoxixi 依赖在 catalogs 中存在
  ensureMoluoxixiCatalogs(merged)

  return merged
}

/**
 * 确保 @moluoxixi 依赖在 catalogs 中存在
 * @param workspace pnpm-workspace 对象
 */
export function ensureMoluoxixiCatalogs(workspace: Partial<PnpmWorkspaceType>): void {
  if (!workspace.catalogs) {
    workspace.catalogs = { build: {}, dev: {}, type: {} }
  }

  // build catalog
  workspace.catalogs.build['@moluoxixi/ajax-package'] = 'latest'
  workspace.catalogs.build['@moluoxixi/class-names'] = 'latest'

  // dev catalog
  workspace.catalogs.dev['@moluoxixi/ajax-package'] = 'latest'
  workspace.catalogs.dev['@moluoxixi/eslint-config'] = 'latest'
  workspace.catalogs.dev['@moluoxixi/vite-config'] = 'latest'
  workspace.catalogs.dev['@moluoxixi/css-module-global-root-plugin'] = 'latest'
}

/**
 * 按字母排序对象
 * @param obj 对象
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
 * 根据配置获取特性依赖
 * @param config 项目配置
 */
export function getFeatureDependencies(config: ProjectConfigType): {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
} {
  const dependencies: Record<string, string> = {}
  const devDependencies: Record<string, string> = {}

  // i18n
  if (config.i18n) {
    if (config.framework === 'vue') {
      dependencies['vue-i18n'] = 'catalog:build'
    }
    else {
      dependencies.i18next = 'catalog:build'
      dependencies['react-i18next'] = 'catalog:build'
    }
  }

  // 文件系统路由
  if (config.routeMode === 'file-system') {
    dependencies['vite-plugin-pages'] = 'catalog:build'
  }

  // Qiankun
  if (config.qiankun) {
    dependencies['vite-plugin-qiankun'] = 'catalog:build'
  }

  // Sentry
  if (config.sentry) {
    if (config.framework === 'vue') {
      dependencies['@sentry/vue'] = 'catalog:build'
    }
    else {
      dependencies['@sentry/react'] = 'catalog:build'
    }
    dependencies['@sentry/vite-plugin'] = 'catalog:build'
  }

  return { dependencies, devDependencies }
}
