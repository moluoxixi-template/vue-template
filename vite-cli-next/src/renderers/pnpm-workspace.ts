/**
 * pnpm-workspace.yaml 渲染器
 * 生成 pnpm-workspace.yaml 配置
 */

import type { PnpmWorkspaceType, ProjectConfigType } from '../types'
import { ensureMoluoxixiCatalogs } from '../utils/merge'
import YAML from 'yaml'

/**
 * 获取 Vue 基础 pnpm-workspace 配置
 * @param config 项目配置
 */
export function getVueBasePnpmWorkspace(config: ProjectConfigType): PnpmWorkspaceType {
  const buildCatalog: Record<string, string> = {
    '@moluoxixi/ajax-package': 'latest',
    '@moluoxixi/class-names': 'latest',
    'crypto-js': '^4.2.0',
    'dayjs': '^1.11.13',
    'lodash-es': '^4.17.21',
    'pinia': '^2.3.0',
    'pinia-plugin-persistedstate': '^4.2.0',
    'radash': '^12.1.0',
    'uuid': '^11.1.0',
    'vue': '^3.5.13',
    'vue-router': '^4.5.0',
  }

  // UI 库
  if (config.uiLibrary === 'element-plus') {
    buildCatalog['@element-plus/icons-vue'] = '^2.3.1'
    buildCatalog['element-plus'] = '^2.11.3'
  }
  else if (config.uiLibrary === 'ant-design-vue') {
    buildCatalog['@ant-design/icons-vue'] = '^7.0.1'
    buildCatalog['ant-design-vue'] = '^4.2.1'
  }

  // 可选特性依赖
  if (config.i18n) {
    buildCatalog['vue-i18n'] = '^11.1.10'
  }

  if (config.routeMode === 'file-system') {
    buildCatalog['vite-plugin-pages'] = '^0.32.5'
  }

  if (config.qiankun) {
    buildCatalog['vite-plugin-qiankun'] = '^1.0.15'
  }

  if (config.sentry) {
    buildCatalog['@sentry/vue'] = '^9.27.0'
    buildCatalog['@sentry/vite-plugin'] = '^3.5.0'
  }

  return {
    gitChecks: false,
    registry: 'https://registry.npmjs.org/',
    catalogs: {
      build: buildCatalog,
      dev: {
        '@commitlint/cli': '^19.8.0',
        '@commitlint/config-conventional': '^19.8.0',
        '@moluoxixi/ajax-package': 'latest',
        '@moluoxixi/css-module-global-root-plugin': 'latest',
        '@moluoxixi/eslint-config': 'latest',
        '@moluoxixi/vite-config': 'latest',
        '@vue-macros/volar': '^3.0.0-beta.15',
        'autoprefixer': '^10.4.20',
        'commitizen': '^4.3.1',
        'compressing': '^1.10.1',
        'cz-customizable': '^7.4.0',
        'dotenv': '^16.5.0',
        'eslint': '^9.22.0',
        'eslint-plugin-format': '^1.0.1',
        'husky': '^9.1.7',
        'jiti': '^2.4.2',
        'lint-staged': '^15.5.1',
        'postcss': '^8.5.3',
        'sass': '^1.87.0',
        'sass-embedded': '^1.87.0',
        'sass-loader': '^16.0.5',
        'tailwindcss': '^4.0.0',
        'tsx': '^4.19.2',
        'typescript': '~5.8.0',
        'vite': '^6.2.4',
        'vue-tsc': '^2.2.8',
      },
      type: {
        '@types/crypto-js': '^4.2.2',
        '@types/lodash-es': '^4.17.12',
        '@types/node': '^22.14.0',
        '@types/uuid': '^10.0.0',
      },
    },
  }
}

/**
 * 获取 React 基础 pnpm-workspace 配置
 * @param config 项目配置
 */
export function getReactBasePnpmWorkspace(config: ProjectConfigType): PnpmWorkspaceType {
  const buildCatalog: Record<string, string> = {
    '@moluoxixi/ajax-package': 'latest',
    '@moluoxixi/class-names': 'latest',
    'crypto-js': '^4.2.0',
    'dayjs': '^1.11.13',
    'lodash-es': '^4.17.21',
    'radash': '^12.1.0',
    'react': '^18.3.1',
    'react-dom': '^18.3.1',
    'react-router-dom': '^6.28.0',
    'uuid': '^11.1.0',
    'zustand': '^5.0.0',
  }

  // UI 库
  if (config.uiLibrary === 'ant-design') {
    buildCatalog['@ant-design/icons'] = '^5.5.1'
    buildCatalog.antd = '^5.22.0'
  }

  // 可选特性依赖
  if (config.i18n) {
    buildCatalog.i18next = '^24.0.0'
    buildCatalog['react-i18next'] = '^15.1.0'
  }

  if (config.routeMode === 'file-system') {
    buildCatalog['vite-plugin-pages'] = '^0.32.5'
  }

  if (config.qiankun) {
    buildCatalog['vite-plugin-qiankun'] = '^1.0.15'
  }

  if (config.sentry) {
    buildCatalog['@sentry/react'] = '^9.27.0'
    buildCatalog['@sentry/vite-plugin'] = '^3.5.0'
  }

  return {
    gitChecks: false,
    registry: 'https://registry.npmjs.org/',
    catalogs: {
      build: buildCatalog,
      dev: {
        '@commitlint/cli': '^19.8.0',
        '@commitlint/config-conventional': '^19.8.0',
        '@moluoxixi/ajax-package': 'latest',
        '@moluoxixi/css-module-global-root-plugin': 'latest',
        '@moluoxixi/eslint-config': 'latest',
        '@moluoxixi/vite-config': 'latest',
        '@vitejs/plugin-react': '^4.3.4',
        'autoprefixer': '^10.4.20',
        'commitizen': '^4.3.1',
        'compressing': '^1.10.1',
        'cz-customizable': '^7.4.0',
        'dotenv': '^16.5.0',
        'eslint': '^9.22.0',
        'eslint-plugin-format': '^1.0.1',
        'husky': '^9.1.7',
        'jiti': '^2.4.2',
        'lint-staged': '^15.5.1',
        'postcss': '^8.5.3',
        'sass': '^1.87.0',
        'sass-embedded': '^1.87.0',
        'sass-loader': '^16.0.5',
        'tailwindcss': '^4.0.0',
        'tsx': '^4.19.2',
        'typescript': '~5.8.0',
        'vite': '^6.2.4',
      },
      type: {
        '@types/crypto-js': '^4.2.2',
        '@types/lodash-es': '^4.17.12',
        '@types/node': '^22.14.0',
        '@types/react': '^18.3.12',
        '@types/react-dom': '^18.3.1',
        '@types/uuid': '^10.0.0',
      },
    },
  }
}

/**
 * 生成 pnpm-workspace.yaml 内容
 * @param config 项目配置
 */
export function generatePnpmWorkspace(config: ProjectConfigType): string {
  const baseWorkspace = config.framework === 'vue'
    ? getVueBasePnpmWorkspace(config)
    : getReactBasePnpmWorkspace(config)

  // 确保 @moluoxixi 依赖存在
  ensureMoluoxixiCatalogs(baseWorkspace)

  // 生成 YAML 注释头
  const header = `# pnpm workspace 配置
# 用于管理项目依赖版本

`

  return header + YAML.stringify(baseWorkspace)
}
