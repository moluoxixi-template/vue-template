/**
 * Vue 项目生成器
 * 生成 Vue 3 项目结构
 */

import { join } from 'path'
import { createDir, copyAndRenderTemplate, copyStaticFile, writeFile } from '../utils/file'
import { getDependencies, getDevDependencies } from '../utils/dependencies'
import type { ProjectConfig } from '../types'

/**
 * 生成 Vue 项目
 * @param config 项目配置
 */
export async function generateVueProject(config: ProjectConfig): Promise<void> {
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
  const packageJson = {
    name: config.projectName,
    version: '0.0.0',
    type: 'module',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'vite build --mode production',
      preview: 'vite preview',
      'type-check': 'vue-tsc --noEmit',
      'lint:eslint': 'eslint . --fix',
    },
    dependencies: getDependencies(config),
    devDependencies: getDevDependencies(config),
    author: config.author,
    license: 'MIT',
  }

  // 写入 package.json
  copyAndRenderTemplate(
    'vue/package.json.ejs',
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
  ]

  configFiles.forEach((file) => {
    copyAndRenderTemplate(
      `vue/${file}.ejs`,
      join(targetDir, file),
      config,
    )
  })

  // .env.example 文件（特殊处理，因为可能被 gitignore）
  try {
    copyAndRenderTemplate(
      'vue/env.example.ejs',
      join(targetDir, '.env.example'),
      config,
    )
  }
  catch {
    // 如果模板不存在，创建一个简单的 .env.example
    const envExample = `# 项目标题
VITE_APP_TITLE=${config.projectName}

# 项目 code（用于路由 base 和 qiankun）
VITE_APP_CODE=/${config.projectName}

# 项目端口
VITE_APP_PORT=5173

# API 基础 URL
VITE_API_BASE_URL=/api
${config.sentry ? '\n# Sentry DSN（仅在生产环境配置）\n# VITE_SENTRY=https://xxx@xxx.ingest.sentry.io/xxx\n\n# 应用版本号（用于 Sentry 追踪）\n# VITE_APP_VERSION=1.0.0' : ''}
`
    writeFile(join(targetDir, '.env.example'), envExample)
  }
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
    'directives',
    'layouts',
    'locales/lang',
    'router',
    'stores/modules',
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

  // main.ts
  copyAndRenderTemplate(
    'vue/src/main.ts.ejs',
    join(targetDir, 'src/main.ts'),
    config,
  )

  // App.vue
  copyAndRenderTemplate(
    'vue/src/App.vue.ejs',
    join(targetDir, 'src/App.vue'),
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
      'vue/src/router/index.pages.ts.ejs',
      join(targetDir, 'src/router/index.ts'),
      config,
    )
  }
  else {
    // 手动路由模式
    copyAndRenderTemplate(
      'vue/src/router/index.manual.ts.ejs',
      join(targetDir, 'src/router/index.ts'),
      config,
    )
    copyAndRenderTemplate(
      'vue/src/router/routes.ts.ejs',
      join(targetDir, 'src/router/routes.ts'),
      config,
    )
  }

  // layout.vue
  copyAndRenderTemplate(
    'vue/src/router/layout.vue.ejs',
    join(targetDir, 'src/router/layout.vue'),
    config,
  )
}

/**
 * 生成状态管理文件
 * @param config 项目配置
 */
function generateStoreFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // stores/index.ts
  copyAndRenderTemplate(
    'vue/src/stores/index.ts.ejs',
    join(targetDir, 'src/stores/index.ts'),
    config,
  )

  // stores/modules/system.ts
  copyAndRenderTemplate(
    'vue/src/stores/modules/system.ts.ejs',
    join(targetDir, 'src/stores/modules/system.ts'),
    config,
  )

  // stores/modules/user.ts
  copyAndRenderTemplate(
    'vue/src/stores/modules/user.ts.ejs',
    join(targetDir, 'src/stores/modules/user.ts'),
    config,
  )
}

/**
 * 生成布局文件
 * @param config 项目配置
 */
function generateLayoutFiles(config: ProjectConfig): void {
  const { targetDir } = config

  // layouts/index.ts
  copyAndRenderTemplate(
    'vue/src/layouts/index.ts.ejs',
    join(targetDir, 'src/layouts/index.ts'),
    config,
  )

  // layouts/element.vue 或 layouts/ant-design.vue
  const layoutFile = config.uiLibrary === 'element-plus'
    ? 'element.vue'
    : 'ant-design.vue'

  copyAndRenderTemplate(
    `vue/src/layouts/${layoutFile}.ejs`,
    join(targetDir, `src/layouts/${layoutFile}`),
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
    'vue/src/locales/index.ts.ejs',
    join(targetDir, 'src/locales/index.ts'),
    config,
  )

  // 语言文件
  const langs = ['zh', 'en', 'es']
  langs.forEach((lang) => {
    copyAndRenderTemplate(
      `vue/src/locales/lang/${lang}.ts.ejs`,
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
    'vue/src/utils/index.ts.ejs',
    join(targetDir, 'src/utils/index.ts'),
    config,
  )

  // utils/sentry.ts（如果启用 Sentry）
  if (config.sentry) {
    copyAndRenderTemplate(
      'vue/src/utils/sentry.ts.ejs',
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
    'vue/src/pages/home/index.vue.ejs',
    join(targetDir, 'src/pages/home/index.vue'),
    config,
  )

  // 示例页面：about
  copyAndRenderTemplate(
    'vue/src/pages/about/index.vue.ejs',
    join(targetDir, 'src/pages/about/index.vue'),
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

