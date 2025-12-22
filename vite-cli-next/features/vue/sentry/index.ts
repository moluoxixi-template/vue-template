/**
 * Sentry (错误监控) Feature
 * 主入口文件，聚合各个配置片段
 */

import type { FeatureDeclaration } from '../../../core/orchestrator/types.ts'
import * as mainData from './main.data.ts'
import * as viteData from './viteConfig.data.ts'

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
