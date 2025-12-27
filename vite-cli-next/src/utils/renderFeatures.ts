/**
 * Features 渲染工具
 * 统一处理 features 的渲染逻辑
 */

import type { ProjectConfigType } from '../types'

import path from 'node:path'

import { getTemplatesDir } from './file'
import { renderTemplate } from './renderTemplate'

/**
 * 渲染框架特定的 features
 * @param config 项目配置
 * @param targetDir 目标目录
 */
export function renderFrameworkFeatures(config: ProjectConfigType, targetDir: string): void {
  const templatesDir = getTemplatesDir()
  const framework = config.framework

  // 定义 features 映射：配置项名称 -> feature 目录名称
  const featureMap: Record<string, string> = {
    router: 'router',
    stateManagement: framework === 'vue' ? 'pinia' : 'zustand',
    eslint: 'eslint',
    i18n: 'i18n',
    sentry: 'sentry',
    qiankun: 'qiankun',
  }

  // 统一处理布尔类型的 features
  for (const [configKey, featureName] of Object.entries(featureMap)) {
    if (config[configKey as keyof ProjectConfigType] === true) {
      const featurePath = path.join(templatesDir, framework, 'features', featureName)
      renderTemplate(featurePath, targetDir)
    }
  }

  // 特殊处理：路由模式相关的 features
  if (config.routeMode === 'manual') {
    renderTemplate(path.join(templatesDir, framework, 'features', 'manualRoutes'), targetDir)
  }
  else if (config.routeMode === 'file-system') {
    renderTemplate(path.join(templatesDir, framework, 'features', 'pageRoutes'), targetDir)
  }

  // 特殊处理：UI 库相关的 features
  if (framework === 'vue') {
    if (config.uiLibrary === 'element-plus') {
      renderTemplate(path.join(templatesDir, framework, 'features', 'element-plus'), targetDir)
    }
    else if (config.uiLibrary === 'ant-design-vue') {
      renderTemplate(path.join(templatesDir, framework, 'features', 'ant-design-vue'), targetDir)
    }
  }
  else if (framework === 'react') {
    if (config.uiLibrary === 'ant-design') {
      renderTemplate(path.join(templatesDir, framework, 'features', 'ant-design'), targetDir)
    }
  }
}

/**
 * 渲染公共 features
 * @param config 项目配置
 * @param targetDir 目标目录
 */
export function renderCommonFeatures(config: ProjectConfigType, targetDir: string): void {
  const templatesDir = getTemplatesDir()

  // 公共 features 映射
  const commonFeatureMap: Record<string, string> = {
    gitHooks: 'husky',
  }

  for (const [configKey, featureName] of Object.entries(commonFeatureMap)) {
    if (config[configKey as keyof ProjectConfigType] === true) {
      const featurePath = path.join(templatesDir, 'common', 'features', featureName)
      renderTemplate(featurePath, targetDir)
    }
  }
}
