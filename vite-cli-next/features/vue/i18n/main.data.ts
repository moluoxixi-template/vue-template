/**
 * i18n Feature - main.ts 配置片段
 * 文件路径对应生成的文件：src/main.ts
 */

import type { ImportDeclaration, SetupHook } from '../../core/orchestrator/types.ts'

export const imports: ImportDeclaration[] = [
  {
    from: '@/locales',
    default: 'i18n',
    priority: 100,
  },
]

export const hooks: SetupHook[] = [
  {
    name: 'i18n-install',
    code: 'app.use(i18n)',
    order: 35,
    deps: [],
  },
]
