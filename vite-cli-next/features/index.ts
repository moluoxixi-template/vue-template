/**
 * Feature 模块注册表
 * 每个 Feature 必须导出自己的声明式配置
 */

import type { FeatureDeclaration } from '../core/orchestrator/types.ts'

// React Features
import antDesignFeature from './react/antDesign/index.ts'
import i18nReactFeature from './react/i18n/index.ts'
import qiankunReactFeature from './react/qiankun/index.ts'
import routeManualReactFeature from './react/routeManual/index.ts'
import routerReactFeature from './react/router/index.ts'
import sentryReactFeature from './react/sentry/index.ts'
// Vue Features
import antDesignVueFeature from './vue/antDesignVue/index.ts'
import directivesFeature from './vue/directives/index.ts'

import elementPlusFeature from './vue/elementPlus/index.ts'
import i18nFeature from './vue/i18n/index.ts'
import qiankunFeature from './vue/qiankun/index.ts'
import routerFeature from './vue/router/index.ts'
import sentryFeature from './vue/sentry/index.ts'
import storeFeature from './vue/store/index.ts'

export const vueFeatures: Record<string, FeatureDeclaration> = {
  antDesignVue: antDesignVueFeature,
  directives: directivesFeature,
  elementPlus: elementPlusFeature,
  i18n: i18nFeature,
  qiankun: qiankunFeature,
  router: routerFeature,
  sentry: sentryFeature,
  store: storeFeature,
}

export const reactFeatures: Record<string, FeatureDeclaration> = {
  antDesign: antDesignFeature,
  i18n: i18nReactFeature,
  qiankun: qiankunReactFeature,
  router: routerReactFeature,
  routeManual: routeManualReactFeature,
  sentry: sentryReactFeature,
}

export function getEnabledFeatures(
  framework: 'vue' | 'react',
  config: Record<string, unknown>,
): FeatureDeclaration[] {
  const features = framework === 'vue' ? vueFeatures : reactFeatures
  const enabled: FeatureDeclaration[] = []

  for (const feature of Object.values(features)) {
    if (feature.enabled(config)) {
      enabled.push(feature)
    }
  }

  return enabled
}
