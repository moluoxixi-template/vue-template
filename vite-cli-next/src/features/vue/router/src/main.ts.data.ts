/**
 * Router Feature - main.ts 配置片段
 * 文件路径对应生成的文件：src/main.ts
 */

import type { SetupHook } from '../../../../core/orchestrator/types'

export const hooks: SetupHook[] = [
  {
    name: 'router-init',
    code: 'const router = getRouter({{QIANKUN_PLACEHOLDER}})',
    order: 20, // 在 directives 之后，store 之前
    deps: [], // 无依赖
  },
  {
    name: 'router-install',
    code: 'app.use(router)',
    order: 25,
    deps: ['router-init'], // 依赖 router-init
  },
]

