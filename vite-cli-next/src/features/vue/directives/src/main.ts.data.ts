/**
 * Directives Feature - main.ts 配置片段
 * 文件路径对应生成的文件：src/main.ts
 */

import type { ImportDeclaration, SetupHook } from '../../../../core/orchestrator/types'

export const imports: ImportDeclaration[] = [
  {
    from: '@/directives',
    default: 'directives',
    priority: 50,
  },
]

export const hooks: SetupHook[] = [
  {
    name: 'directives-register',
    code: '// 注册指令\ndirectives(app)',
    order: 10, // 最优先执行
    deps: [],
  },
]

