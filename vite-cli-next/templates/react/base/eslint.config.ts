/**
 * ESLint 配置
 * 基于 @antfu/eslint-config 封装的 @moluoxixi/eslint-config
 */

import eslintConfig from '@moluoxixi/eslint-config'

export default eslintConfig({
  react: true,
  typescript: true,
  ignores: [],
  rules: {
    'perfectionist/sort-imports': 'off',
    'jsonc/sort-keys': 'off',
  },
})
