/**
 * Vue package.json 数据配置
 * 用于深度合并生成 package.json
 */

import type { PackageJsonType, ProjectConfigType } from '../../src/types';

/**
 * 获取 Vue 基础 package.json 配置
 */
export function getVuePackageJson(config: ProjectConfigType): Partial<PackageJsonType> {
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
  };

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
  };

  // UI 库依赖
  if (config.uiLibrary === 'element-plus') {
    dependencies['@element-plus/icons-vue'] = 'catalog:build';
    dependencies['element-plus'] = 'catalog:build';
  } else if (config.uiLibrary === 'ant-design-vue') {
    dependencies['@ant-design/icons-vue'] = 'catalog:build';
    dependencies['ant-design-vue'] = 'catalog:build';
  }

  // 可选依赖
  if (config.i18n) {
    dependencies['vue-i18n'] = 'catalog:build';
  }

  if (config.routeMode === 'file-system') {
    dependencies['vite-plugin-pages'] = 'catalog:build';
  }

  if (config.qiankun) {
    dependencies['vite-plugin-qiankun'] = 'catalog:build';
  }

  if (config.sentry) {
    dependencies['@sentry/vite-plugin'] = 'catalog:build';
    dependencies['@sentry/vue'] = 'catalog:build';
  }

  // 按字母排序
  const sortedDependencies = Object.keys(dependencies)
    .sort()
    .reduce((obj, key) => {
      obj[key] = dependencies[key];
      return obj;
    }, {} as Record<string, string>);

  return {
    name: config.projectName,
    version: '0.0.0',
    type: 'module',
    private: true,
    engines: {
      node: '>=20.18.0',
    },
    packageManager: 'pnpm@10.8.0',
    scripts: {
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
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    'lint-staged': {
      '*.{js,jsx,ts,tsx,vue,css,scss,less}': ['eslint --fix --no-warn-ignored'],
    },
    config: {
      commitizen: {
        path: 'cz-customizable',
      },
      'cz-customizable': {
        config: '.cz-config.cjs',
      },
    },
    dependencies: sortedDependencies,
    devDependencies,
    author: config.author || '',
    license: 'MIT',
  };
}

