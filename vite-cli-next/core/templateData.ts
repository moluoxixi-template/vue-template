/**
 * 模板数据预处理层
 * 作为"配置申报员"，将 Feature 声明提交给中央处理器
 */

import type { ProjectConfig } from '../types/index.js'
import type { ProcessedTemplateData } from './orchestrator/types.js'
import { getEnabledFeatures } from '../features/index.js'
import { processFeatureDeclarations } from './orchestrator/processor.js'

export function createTemplateData(config: ProjectConfig): ProcessedTemplateData {
  const configRecord: Record<string, unknown> = {
    ...config,
    framework: config.framework,
    uiLibrary: config.uiLibrary,
    routeMode: config.routeMode,
    i18n: config.i18n,
    qiankun: config.qiankun,
    sentry: config.sentry,
  }

  const features = getEnabledFeatures(config.framework, configRecord)

  return processFeatureDeclarations(features, configRecord)
}

export type { ProcessedTemplateData as TemplateData } from './orchestrator/types.js'
