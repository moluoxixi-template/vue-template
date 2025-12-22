/**
 * 分层解析器
 * 根据项目配置解析需要合并的层
 */

import type { FeatureConfig, LayerConfig, ProjectConfig } from '../types'
import { join } from 'node:path'
import process from 'node:process'

/**
 * 获取模板根目录
 */
export function getTemplatesDir(): string {
  // 开发环境使用源码目录，生产环境使用 dist 目录
  const baseDir = new URL('../..', import.meta.url).pathname
  // Windows 兼容处理
  const normalizedPath = baseDir.startsWith('/') && process.platform === 'win32'
    ? baseDir.slice(1)
    : baseDir
  return join(normalizedPath, 'templates')
}

/**
 * 解析项目需要的所有层
 * @param config 项目配置
 * @returns 层配置数组（按合并顺序）
 */
export function resolveLayers(config: ProjectConfig): LayerConfig[] {
  const templatesDir = getTemplatesDir()
  const layers: LayerConfig[] = []

  // L0: Common 层（始终包含）
  layers.push({
    type: 'common',
    path: join(templatesDir, 'common'),
    name: 'common',
  })

  // L1: Framework Base 层
  layers.push({
    type: 'base',
    path: join(templatesDir, config.framework, 'base'),
    name: `${config.framework}-base`,
  })

  // L2: Feature 层（根据配置启用）
  const features = resolveFeatures(config)
  for (const feature of features) {
    if (feature.enabled) {
      layers.push({
        type: 'feature',
        path: feature.path,
        name: feature.name,
      })
    }
  }

  return layers
}

/**
 * 解析项目需要的特性
 * @param config 项目配置
 * @returns 特性配置数组
 */
export function resolveFeatures(config: ProjectConfig): FeatureConfig[] {
  const templatesDir = getTemplatesDir()
  const featuresDir = join(templatesDir, config.framework, 'features')
  const features: FeatureConfig[] = []

  // UI 库特性
  if (config.framework === 'vue') {
    features.push({
      name: 'element-plus',
      path: join(featuresDir, 'element-plus'),
      enabled: config.uiLibrary === 'element-plus',
    })
    features.push({
      name: 'ant-design-vue',
      path: join(featuresDir, 'ant-design-vue'),
      enabled: config.uiLibrary === 'ant-design-vue',
    })
  }
  else if (config.framework === 'react') {
    features.push({
      name: 'ant-design',
      path: join(featuresDir, 'ant-design'),
      enabled: config.uiLibrary === 'ant-design',
    })
  }

  // 国际化特性
  features.push({
    name: 'i18n',
    path: join(featuresDir, 'i18n'),
    enabled: config.i18n,
  })

  // 微前端特性
  features.push({
    name: 'qiankun',
    path: join(featuresDir, 'qiankun'),
    enabled: config.qiankun,
  })

  // Sentry 错误监控特性
  features.push({
    name: 'sentry',
    path: join(featuresDir, 'sentry'),
    enabled: config.sentry,
  })

  // 路由特性（互斥）
  features.push({
    name: 'route-pages',
    path: join(featuresDir, 'route-pages'),
    enabled: config.routeMode === 'file-system',
  })
  features.push({
    name: 'route-manual',
    path: join(featuresDir, 'route-manual'),
    enabled: config.routeMode === 'manual',
  })

  return features
}

/**
 * 获取启用的特性名称列表
 * @param config 项目配置
 * @returns 特性名称数组
 */
export function getEnabledFeatureNames(config: ProjectConfig): string[] {
  return resolveFeatures(config)
    .filter(f => f.enabled)
    .map(f => f.name)
}
