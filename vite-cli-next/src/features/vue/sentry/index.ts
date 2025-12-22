/**
 * Sentry (错误监控) Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../../core/orchestrator/types'
import * as mainData from './src/main.ts.data'
import * as viteData from './vite.config.ts.data'

export default {
  name: 'sentry',
  enabled: (config: Record<string, unknown>) => Boolean(config.sentry),
  main: {
    imports: mainData.imports,
    hooks: mainData.hooks,
  },
  vite: {
    plugins: viteData.plugins,
  },
} satisfies FeatureDeclaration
