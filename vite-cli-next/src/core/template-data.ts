/**
 * 模板数据预处理层
 * 作为"配置申报员"，将 Feature 声明提交给中央处理器
 */

import type { ProjectConfig } from '../types'
import type { ProcessedTemplateData } from './orchestrator/types'
import { getEnabledFeatures } from '../features'
import { processFeatureDeclarations } from './orchestrator/processor'

/**
 * 创建模板渲染数据
 * 使用中央配置处理器统一处理所有 Feature 声明
 */
export function createTemplateData(config: ProjectConfig): ProcessedTemplateData {
  // 将 ProjectConfig 转换为通用配置对象
  const configRecord: Record<string, unknown> = {
    ...config,
    framework: config.framework,
    uiLibrary: config.uiLibrary,
    routeMode: config.routeMode,
    i18n: config.i18n,
    qiankun: config.qiankun,
    sentry: config.sentry,
  }

  // 获取所有启用的 Feature 声明
  const features = getEnabledFeatures(config.framework, configRecord)

  // 提交给中央处理器进行统一处理
  return processFeatureDeclarations(features, configRecord)
}

// 导出类型供模板使用
export type { ProcessedTemplateData as TemplateData } from './orchestrator/types'
