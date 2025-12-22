/**
 * Element Plus UI Library Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../core/orchestrator/types.ts'
import * as mainData from './main.data.ts'
import * as viteData from './viteConfig.data.ts'

export default {
  name: 'elementPlus',
  enabled: (config: Record<string, unknown>) => config.uiLibrary === 'elementPlus',
  main: {
    styles: mainData.styles,
  },
  vite: {
    configs: viteData.configs,
  },
} satisfies FeatureDeclaration
