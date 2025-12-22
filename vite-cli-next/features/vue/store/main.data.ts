/**
 * Store (Pinia) Feature - main.ts 配置片段
 * 文件路径对应生成的文件：src/main.ts
 */

import type { ImportDeclaration, SetupHook } from '../../core/orchestrator/types.ts'

export const imports: ImportDeclaration[] = [
  {
    from: '@/stores',
    named: ['store'],
    priority: 100,
  },
]

export const hooks: SetupHook[] = [
  {
    name: 'pinia-store',
    code: 'app.use(store)',
    order: 30,
    deps: [],
  },
]
