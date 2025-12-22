/**
 * Feature 模块注册表
 * 每个 Feature 必须导出自己的代码片段
 */

import type { FeatureDeclaration as FeatureManifest } from '../core/orchestrator/types'
import directivesFeature from './vue/directives'
import i18nFeature from './vue/i18n'
import qiankunFeature from './vue/qiankun'
import routerFeature from './vue/router'
import sentryFeature from './vue/sentry'
import storeFeature from './vue/store'
import uiAntDesignVueFeature from './vue/ui-ant-design-vue'
import uiElementPlusFeature from './vue/ui-element-plus'

/**
 * Vue Features 注册表
 */
export const vueFeatures: Record<string, FeatureManifest> = {
  'directives': directivesFeature,
  'store': storeFeature,
  'router': routerFeature,
  'i18n': i18nFeature,
  'qiankun': qiankunFeature,
  'sentry': sentryFeature,
  'ui-ant-design-vue': uiAntDesignVueFeature,
  'ui-element-plus': uiElementPlusFeature,
}

/**
 * 获取启用的 Features
 */
export function getEnabledFeatures(
  framework: 'vue' | 'react',
  config: Record<string, unknown>,
): FeatureManifest[] {
  const features = framework === 'vue' ? vueFeatures : {}
  const enabled: FeatureManifest[] = []

  for (const feature of Object.values(features)) {
    if (feature.enabled(config)) {
      enabled.push(feature)
    }
  }

  return enabled
}
