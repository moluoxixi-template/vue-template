/**
 * React 项目生成器
 * 生成 React 项目结构
 */

import { join } from 'path'
import { createDir, copyAndRenderTemplate } from '../utils/file'
import { getDependencies, getDevDependencies } from '../utils/dependencies'
import type { ProjectConfig } from '../types'

/**
 * 生成 React 项目
 * @param config 项目配置
 */
export async function generateReactProject(config: ProjectConfig): Promise<void> {
  const { targetDir } = config

  // 生成基础配置文件
  generateConfigFiles(config)

  // 生成源代码目录结构
  generateSrcStructure(config)

  // 生成 apis 目录
  generateApisStructure(config)
}

/**
 * 生成配置文件
 * @param config 项目配置
 */
function generateConfigFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // package.json
  copyAndRenderTemplate(
    'react/package.json.ejs',
    join(targetDir, 'package.json'),
    config,
  )

  // 其他配置文件
  const configFiles = [
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'eslint.config.ts',
    'commitlint.config.ts',
    'env.d.ts',
    'index.html',
    '.gitignore',
    '.env.example',
  ]

  configFiles.forEach((file) => {
    copyAndRenderTemplate(
      `react/${file}.ejs`,
      join(targetDir, file),
      config,
    )
  })
}

/**
 * 生成源代码目录结构
 * @param config 项目配置
 */
function generateSrcStructure(config: ProjectConfig): void {
  const { targetDir } = config
  const srcDir = join(targetDir, 'src')

  // 创建主要目录
  const dirs = [
    'assets/styles',
    'assets/fonts',
    'components',
    'constants',
    'layouts',
    'locales/lang',
    'router',
    'stores',
    'utils/modules',
    'pages',
    'apis/types',
    'apis/services',
  ]

  dirs.forEach((dir) => {
    createDir(join(srcDir, dir))
  })

  // 生成主要文件
  generateMainFiles(config)
  generateRouterFiles(config)
  generateStoreFiles(config)
  generateLayoutFiles(config)
  generateLocaleFiles(config)
  generateUtilsFiles(config)
  generatePagesFiles(config)
}

/**
 * 生成主要文件
 * @param config 项目配置
 */
function generateMainFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // main.tsx
  copyAndRenderTemplate(
    'react/src/main.tsx.ejs',
    join(targetDir, 'src/main.tsx'),
    config,
  )

  // App.tsx
  copyAndRenderTemplate(
    'react/src/App.tsx.ejs',
    join(targetDir, 'src/App.tsx'),
    config,
  )
}

/**
 * 生成路由文件
 * @param config 项目配置
 */
function generateRouterFiles(config: ProjectConfig): void {
  const { targetDir } = config

  if (config.routeMode === 'file-system') {
    // 文件系统路由模式
    copyAndRenderTemplate(
      'react/src/router/index.pages.tsx.ejs',
      join(targetDir, 'src/router/index.tsx'),
      config,
    )
  }
  else {
    // 手动路由模式
    copyAndRenderTemplate(
      'react/src/router/index.manual.tsx.ejs',
      join(targetDir, 'src/router/index.tsx'),
      config,
    )
    copyAndRenderTemplate(
      'react/src/router/routes.tsx.ejs',
      join(targetDir, 'src/router/routes.tsx'),
      config,
    )
  }
}

/**
 * 生成状态管理文件
 * @param config 项目配置
 */
function generateStoreFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // stores/user.ts
  copyAndRenderTemplate(
    'react/src/stores/user.ts.ejs',
    join(targetDir, 'src/stores/user.ts'),
    config,
  )
}

/**
 * 生成布局文件
 * @param config 项目配置
 */
function generateLayoutFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // layouts/index.tsx
  copyAndRenderTemplate(
    'react/src/layouts/index.tsx.ejs',
    join(targetDir, 'src/layouts/index.tsx'),
    config,
  )
}

/**
 * 生成国际化文件
 * @param config 项目配置
 */
function generateLocaleFiles(config: ProjectConfig): void {
  const { targetDir } = config

  if (!config.i18n) {
    return
  }

  // locales/index.ts
  copyAndRenderTemplate(
    'react/src/locales/index.ts.ejs',
    join(targetDir, 'src/locales/index.ts'),
    config,
  )

  // 语言文件
  const langs = ['zh', 'en', 'es']
  langs.forEach((lang) => {
    copyAndRenderTemplate(
      `react/src/locales/lang/${lang}.ts.ejs`,
      join(targetDir, `src/locales/lang/${lang}.ts`),
      config,
    )
  })
}

/**
 * 生成工具文件
 * @param config 项目配置
 */
function generateUtilsFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // utils/index.ts
  copyAndRenderTemplate(
    'react/src/utils/index.ts.ejs',
    join(targetDir, 'src/utils/index.ts'),
    config,
  )

  // utils/sentry.ts（如果启用 Sentry）
  if (config.sentry) {
    copyAndRenderTemplate(
      'react/src/utils/sentry.ts.ejs',
      join(targetDir, 'src/utils/sentry.ts'),
      config,
    )
  }
}

/**
 * 生成页面文件
 * @param config 项目配置
 */
function generatePagesFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // 示例页面：home
  copyAndRenderTemplate(
    'react/src/pages/home/index.tsx.ejs',
    join(targetDir, 'src/pages/home/index.tsx'),
    config,
  )

  // 示例页面：about
  copyAndRenderTemplate(
    'react/src/pages/about/index.tsx.ejs',
    join(targetDir, 'src/pages/about/index.tsx'),
    config,
  )
}

/**
 * 生成 apis 目录结构
 * @param config 项目配置
 */
function generateApisStructure(config: ProjectConfig): void {
  const { targetDir } = config

  // apis/request.ts
  copyAndRenderTemplate(
    'common/apis/request.ts.ejs',
    join(targetDir, 'src/apis/request.ts'),
    config,
  )

  // apis/types/common.ts
  copyAndRenderTemplate(
    'common/apis/types/common.ts.ejs',
    join(targetDir, 'src/apis/types/common.ts'),
    config,
  )

  // apis/types/user.ts
  copyAndRenderTemplate(
    'common/apis/types/user.ts.ejs',
    join(targetDir, 'src/apis/types/user.ts'),
    config,
  )

  // apis/types/index.ts
  copyAndRenderTemplate(
    'common/apis/types/index.ts.ejs',
    join(targetDir, 'src/apis/types/index.ts'),
    config,
  )

  // apis/services/user.ts
  copyAndRenderTemplate(
    'common/apis/services/user.ts.ejs',
    join(targetDir, 'src/apis/services/user.ts'),
    config,
  )

  // apis/services/example.ts
  copyAndRenderTemplate(
    'common/apis/services/example.ts.ejs',
    join(targetDir, 'src/apis/services/example.ts'),
    config,
  )

  // apis/index.ts
  copyAndRenderTemplate(
    'common/apis/index.ts.ejs',
    join(targetDir, 'src/apis/index.ts'),
    config,
  )
}

