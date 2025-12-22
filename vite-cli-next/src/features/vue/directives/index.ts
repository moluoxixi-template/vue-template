/**
 * Directives Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../../core/orchestrator/types'
import * as mainData from './src/main.ts.data'

export default {
  name: 'directives',
  enabled: () => true, // Directives 始终启用
  main: {
    imports: mainData.imports,
    hooks: mainData.hooks,
  },
} satisfies FeatureDeclaration
