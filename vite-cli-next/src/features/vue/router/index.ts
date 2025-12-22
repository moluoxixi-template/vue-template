/**
 * Router Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration, ImportDeclaration } from '../../../core/orchestrator/types'
import * as mainData from './src/main.ts.data'

export default {
  name: 'router',
  enabled: () => true, // Router 始终启用
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
