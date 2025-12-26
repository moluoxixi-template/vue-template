/**
 * package.json 渲染器
 * 深度合并生成 package.json
 */

import type { PackageJsonType, ProjectConfigType } from '../types'
import { getFeatureDependencies, mergePackageJson, sortObject } from '../utils/merge'

/**
 * 获取 Vue 基础 package.json
 * @param config 项目配置
 */
export function getVueBasePackageJson(config: ProjectConfigType): Partial<PackageJsonType> {
  const dependencies: Record<string, string> = {
    '@moluoxixi/ajax-package': 'catalog:build',
    '@moluoxixi/class-names': 'catalog:build',
    'crypto-js': 'catalog:build',
    'dayjs': 'catalog:build',
    'lodash-es': 'catalog:build',
    'pinia': 'catalog:build',
    'pinia-plugin-persistedstate': 'catalog:build',
    'radash': 'catalog:build',
    'uuid': 'catalog:build',
    'vue': 'catalog:build',
    'vue-router': 'catalog:build',
  }

  // UI 库依赖
  if (config.uiLibrary === 'element-plus') {
    dependencies['@element-plus/icons-vue'] = 'catalog:build'
    dependencies['element-plus'] = 'catalog:build'
  }
  else if (config.uiLibrary === 'ant-design-vue') {
    dependencies['@ant-design/icons-vue'] = 'catalog:build'
    dependencies['ant-design-vue'] = 'catalog:build'
  }

  const devDependencies: Record<string, string> = {
    '@commitlint/cli': 'catalog:dev',
    '@commitlint/config-conventional': 'catalog:dev',
    '@moluoxixi/ajax-package': 'catalog:dev',
    '@moluoxixi/css-module-global-root-plugin': 'catalog:dev',
    '@moluoxixi/eslint-config': 'catalog:dev',
    '@moluoxixi/vite-config': 'catalog:dev',
    '@types/crypto-js': 'catalog:type',
    '@types/lodash-es': 'catalog:type',
    '@types/node': 'catalog:type',
    '@types/uuid': 'catalog:type',
    '@vue-macros/volar': 'catalog:dev',
    'autoprefixer': 'catalog:dev',
    'commitizen': 'catalog:dev',
    'compressing': 'catalog:dev',
    'cz-customizable': 'catalog:dev',
    'dotenv': 'catalog:dev',
    'eslint': 'catalog:dev',
    'eslint-plugin-format': 'catalog:dev',
    'husky': 'catalog:dev',
    'jiti': 'catalog:dev',
    'lint-staged': 'catalog:dev',
    'postcss': 'catalog:dev',
    'sass': 'catalog:dev',
    'sass-embedded': 'catalog:dev',
    'sass-loader': 'catalog:dev',
    'tailwindcss': 'catalog:dev',
    'tsx': 'catalog:dev',
    'typescript': 'catalog:dev',
    'vite': 'catalog:dev',
    'vue-tsc': 'catalog:dev',
  }

  return {
    'name': config.projectName,
    'version': '0.0.0',
    'type': 'module',
    'private': true,
    'engines': { node: '>=20.18.0' },
    'packageManager': 'pnpm@10.8.0',
    'scripts': {
      'dev': 'vite',
      'build': 'vite build --mode production',
      'build:zip': 'vite build --mode production && tsx scripts/build.mts',
      'preview': 'vite preview',
      'type-check': 'vue-tsc --noEmit',
      'lint:eslint': 'eslint . --fix',
      'prepare': 'node .husky/install.mjs',
      'lint-staged': 'lint-staged',
      'commit': 'git add . && git-cz',
    },
    'postcss': {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    'lint-staged': {
      '*.{js,jsx,ts,tsx,vue,css,scss,less}': ['eslint --fix --no-warn-ignored'],
    },
    'config': {
      'commitizen': { path: 'cz-customizable' },
      'cz-customizable': { config: '.cz-config.cjs' },
    },
    'dependencies': sortObject(dependencies),
    'devDependencies': sortObject(devDependencies),
    'author': config.author || '',
    'license': 'MIT',
  }
}

/**
 * 获取 React 基础 package.json
 * @param config 项目配置
 */
export function getReactBasePackageJson(config: ProjectConfigType): Partial<PackageJsonType> {
  const dependencies: Record<string, string> = {
    '@moluoxixi/ajax-package': 'catalog:build',
    '@moluoxixi/class-names': 'catalog:build',
    'crypto-js': 'catalog:build',
    'dayjs': 'catalog:build',
    'lodash-es': 'catalog:build',
    'radash': 'catalog:build',
    'react': 'catalog:build',
    'react-dom': 'catalog:build',
    'react-router-dom': 'catalog:build',
    'uuid': 'catalog:build',
    'zustand': 'catalog:build',
  }

  // UI 库依赖
  if (config.uiLibrary === 'ant-design') {
    dependencies['@ant-design/icons'] = 'catalog:build'
    dependencies.antd = 'catalog:build'
  }

  const devDependencies: Record<string, string> = {
    '@commitlint/cli': 'catalog:dev',
    '@commitlint/config-conventional': 'catalog:dev',
    '@moluoxixi/ajax-package': 'catalog:dev',
    '@moluoxixi/css-module-global-root-plugin': 'catalog:dev',
    '@moluoxixi/eslint-config': 'catalog:dev',
    '@moluoxixi/vite-config': 'catalog:dev',
    '@types/crypto-js': 'catalog:type',
    '@types/lodash-es': 'catalog:type',
    '@types/node': 'catalog:type',
    '@types/react': 'catalog:type',
    '@types/react-dom': 'catalog:type',
    '@types/uuid': 'catalog:type',
    '@vitejs/plugin-react': 'catalog:dev',
    'autoprefixer': 'catalog:dev',
    'commitizen': 'catalog:dev',
    'compressing': 'catalog:dev',
    'cz-customizable': 'catalog:dev',
    'dotenv': 'catalog:dev',
    'eslint': 'catalog:dev',
    'eslint-plugin-format': 'catalog:dev',
    'husky': 'catalog:dev',
    'jiti': 'catalog:dev',
    'lint-staged': 'catalog:dev',
    'postcss': 'catalog:dev',
    'sass': 'catalog:dev',
    'sass-embedded': 'catalog:dev',
    'sass-loader': 'catalog:dev',
    'tailwindcss': 'catalog:dev',
    'tsx': 'catalog:dev',
    'typescript': 'catalog:dev',
    'vite': 'catalog:dev',
  }

  return {
    'name': config.projectName,
    'version': '0.0.0',
    'type': 'module',
    'private': true,
    'engines': { node: '>=20.18.0' },
    'packageManager': 'pnpm@10.8.0',
    'scripts': {
      'dev': 'vite',
      'build': 'vite build --mode production',
      'build:zip': 'vite build --mode production && tsx scripts/build.mts',
      'preview': 'vite preview',
      'type-check': 'tsc --noEmit',
      'lint:eslint': 'eslint . --fix',
      'prepare': 'node .husky/install.mjs',
      'lint-staged': 'lint-staged',
      'commit': 'git add . && git-cz',
    },
    'postcss': {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    'lint-staged': {
      '*.{js,jsx,ts,tsx,css,scss,less}': ['eslint --fix --no-warn-ignored'],
    },
    'config': {
      'commitizen': { path: 'cz-customizable' },
      'cz-customizable': { config: '.cz-config.cjs' },
    },
    'dependencies': sortObject(dependencies),
    'devDependencies': sortObject(devDependencies),
    'author': config.author || '',
    'license': 'MIT',
  }
}

/**
 * 生成完整的 package.json
 * @param config 项目配置
 */
export function generatePackageJson(config: ProjectConfigType): PackageJsonType {
  const basePackageJson = config.framework === 'vue'
    ? getVueBasePackageJson(config)
    : getReactBasePackageJson(config)

  const featureDeps = getFeatureDependencies(config)

  return mergePackageJson(basePackageJson, {
    dependencies: featureDeps.dependencies,
    devDependencies: featureDeps.devDependencies,
  })
}
