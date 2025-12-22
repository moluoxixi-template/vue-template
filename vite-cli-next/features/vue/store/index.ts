/**
 * Store (Pinia) Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../../core/orchestrator/types.ts'
import * as mainData from './main.data.ts'

export default {
  name: 'store',
  enabled: () => true,
  main: {
    imports: mainData.imports,
    hooks: mainData.hooks,
  },
} satisfies FeatureDeclaration
