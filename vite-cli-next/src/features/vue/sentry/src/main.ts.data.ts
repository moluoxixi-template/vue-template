/**
 * Sentry Feature - main.ts 配置片段
 * 文件路径对应生成的文件：src/main.ts
 */

import type { ImportDeclaration, SetupHook } from '../../../../core/orchestrator/types'

export const imports: ImportDeclaration[] = [
  {
    from: '@/utils/sentry',
    named: ['initSentry'],
    priority: 100,
  },
]

export const hooks: SetupHook[] = [
  {
    name: 'sentry-init',
    code: '// 初始化 Sentry（生产环境标准配置）\ninitSentry(app, router)',
    order: 15, // 在 directives 之后，router 之前
    deps: ['router-init'], // 依赖 router 初始化
  },
]

