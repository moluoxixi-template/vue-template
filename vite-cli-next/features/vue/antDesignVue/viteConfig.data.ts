/**
 * Ant Design Vue UI Library Feature - vite.config.ts 配置片段
 * 文件路径对应生成的文件：vite.config.ts
 */

import type { ViteConfigFragment } from '../../core/orchestrator/types.ts'

export const configs: ViteConfigFragment[] = [
  {
    path: 'css.preprocessorOptions.scss',
    strategy: 'replace',
    value: {
      silenceDeprecations: ['legacy-js-api'],
      api: 'modern-compiler',
    },
  },
]
