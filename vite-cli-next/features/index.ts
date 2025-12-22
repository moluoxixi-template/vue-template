/**
 * Feature 模块注册表
 * 每个 Feature 必须导出自己的声明式配置
 *
 * 当前物理目录仍在 src/features 下，这里先通过别名导出，
 * 后续会逐步迁移到顶层 features/vue 与 features/react。
 */

import type { FeatureDeclaration } from '../core/orchestrator/types.ts'
import directivesFeature from '../src/features/vue/directives/index.ts'
import i18nFeature from '../src/features/vue/i18n/index.ts'
import qiankunFeature from '../src/features/vue/qiankun/index.ts'
import routerFeature from '../src/features/vue/router/index.ts'
import sentryFeature from '../src/features/vue/sentry/index.ts'
import storeFeature from '../src/features/vue/store/index.ts'
import uiAntDesignVueFeature from '../src/features/vue/ui-ant-design-vue/index.ts'
import uiElementPlusFeature from '../src/features/vue/ui-element-plus/index.ts'

export const vueFeatures: Record<string, FeatureDeclaration> = {
  directives: directivesFeature,
  store: storeFeature,
  router: routerFeature,
  i18n: i18nFeature,
  qiankun: qiankunFeature,
  sentry: sentryFeature,
  antDesignVue: uiAntDesignVueFeature,
  elementPlus: uiElementPlusFeature,
}

export function getEnabledFeatures(
  framework: 'vue' | 'react',
  config: Record<string, unknown>,
): FeatureDeclaration[] {
  const features = framework === 'vue' ? vueFeatures : {}
  const enabled: FeatureDeclaration[] = []

  for (const feature of Object.values(features)) {
    if (feature.enabled(config)) {
      enabled.push(feature)
    }
  }

  return enabled
}
