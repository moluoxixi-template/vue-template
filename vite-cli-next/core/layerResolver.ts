/**
 * 分层解析器
 * 根据项目配置解析需要合并的层
 */

import type { FeatureConfig, LayerConfig, ProjectConfig } from '../types/index.ts'
import { join } from 'node:path'
import process from 'node:process'

export function getTemplatesDir(): string {
  const baseDir = new URL('..', import.meta.url).pathname
  const normalizedPath = baseDir.startsWith('/') && process.platform === 'win32'
    ? baseDir.slice(1)
    : baseDir
  return join(normalizedPath, 'templates')
}

export function resolveLayers(config: ProjectConfig): LayerConfig[] {
  const templatesDir = getTemplatesDir()
  const layers: LayerConfig[] = []

  layers.push({
    type: 'common',
    path: join(templatesDir, 'common'),
    name: 'common',
  })

  layers.push({
    type: 'base',
    path: join(templatesDir, config.framework, 'base'),
    name: `${config.framework}-base`,
  })

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

export function resolveFeatures(config: ProjectConfig): FeatureConfig[] {
  const templatesDir = getTemplatesDir()
  const featuresDir = join(templatesDir, config.framework, 'features')
  const features: FeatureConfig[] = []

  if (config.framework === 'vue') {
    features.push({
      name: 'elementPlus',
      path: join(featuresDir, 'elementPlus'),
      enabled: config.uiLibrary === 'elementPlus',
    })
    features.push({
      name: 'antDesignVue',
      path: join(featuresDir, 'antDesignVue'),
      enabled: config.uiLibrary === 'antDesignVue',
    })
  }
  else if (config.framework === 'react') {
    features.push({
      name: 'antDesign',
      path: join(featuresDir, 'antDesign'),
      enabled: config.uiLibrary === 'antDesign',
    })
  }

  features.push({
    name: 'i18n',
    path: join(featuresDir, 'i18n'),
    enabled: config.i18n,
  })

  features.push({
    name: 'qiankun',
    path: join(featuresDir, 'qiankun'),
    enabled: config.qiankun,
  })

  features.push({
    name: 'sentry',
    path: join(featuresDir, 'sentry'),
    enabled: config.sentry,
  })

  features.push({
    name: 'routePages',
    path: join(featuresDir, 'routePages'),
    enabled: config.routeMode === 'fileSystem',
  })
  features.push({
    name: 'routeManual',
    path: join(featuresDir, 'routeManual'),
    enabled: config.routeMode === 'manual',
  })

  return features
}

export function getEnabledFeatureNames(config: ProjectConfig): string[] {
  return resolveFeatures(config)
    .filter(f => f.enabled)
    .map(f => f.name)
}
