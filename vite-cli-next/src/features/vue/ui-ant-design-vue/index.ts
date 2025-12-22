/**
 * Ant Design Vue UI Library Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../../core/orchestrator/types'
import * as mainData from './src/main.ts.data'
import * as viteData from './vite.config.ts.data'

export default {
  name: 'ui-ant-design-vue',
  enabled: (config: Record<string, unknown>) => config.uiLibrary === 'ant-design-vue',
  main: {
    styles: mainData.styles,
  },
  vite: {
    configs: viteData.configs,
  },
} satisfies FeatureDeclaration
