/**
 * i18n Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../../core/orchestrator/types.ts'
import * as mainData from './main.data.ts'

export default {
  name: 'i18n',
  enabled: (config: Record<string, unknown>) => Boolean(config.i18n),
  main: {
    imports: mainData.imports,
    hooks: mainData.hooks,
  },
} satisfies FeatureDeclaration
