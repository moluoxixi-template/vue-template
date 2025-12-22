/**
 * Qiankun (微前端) Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../core/orchestrator/types.ts'
import * as mainData from './main.data.ts'

export default {
  name: 'qiankun',
  enabled: (config: Record<string, unknown>) => Boolean(config.qiankun),
  main: {
    imports: mainData.imports,
  },
} satisfies FeatureDeclaration
