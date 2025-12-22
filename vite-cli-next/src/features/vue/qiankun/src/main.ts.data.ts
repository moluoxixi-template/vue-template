/**
 * Qiankun Feature - main.ts 配置片段
 * 文件路径对应生成的文件：src/main.ts
 */

import type { ImportDeclaration } from '../../../../core/orchestrator/types'

export const imports: ImportDeclaration[] = [
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
]

