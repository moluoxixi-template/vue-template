/**
 * Qiankun (微前端) Feature (React)
 */

import type { FeatureDeclaration } from '../../core/orchestrator/types.ts'

export default {
  name: 'qiankun',
  enabled: (config: Record<string, unknown>) => !!config.qiankun,
  main: {
    imports: [
      {
        from: 'vite-plugin-qiankun/dist/helper',
        named: ['QiankunProps'],
        typeOnly: true,
        priority: 10,
      },
      {
        from: 'vite-plugin-qiankun/dist/helper',
        named: ['qiankunWindow', 'renderWithQiankun'],
        priority: 10,
      },
    ],
  },
} satisfies FeatureDeclaration
