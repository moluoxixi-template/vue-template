/**
 * Router Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration, ImportDeclaration } from '../../../core/orchestrator/types.ts'
import * as mainData from './main.data.ts'

export default {
  name: 'router',
  enabled: () => true,
  main: {
    imports: [
      {
        from: './router',
        default: 'getRouter',
        priority: 100,
      },
    ] as ImportDeclaration[],
    hooks: mainData.hooks,
  },
} satisfies FeatureDeclaration
