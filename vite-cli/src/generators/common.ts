/**
 * 通用生成器函数
 * 提取 Vue 和 React 项目生成器中的公共逻辑
 */

import type { ProjectConfig } from '../types/index.ts'
import { join } from 'node:path'
import { copyAndRenderTemplate, createDir, writeFile } from '../utils/file.ts'

/**
 * 生成 apis 目录结构（Vue 和 React 通用）
 * @param config 项目配置
 * @param targetDir 目标目录
 */
export function generateApisStructure(
  config: ProjectConfig,
  targetDir: string,
): void {
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

/**
 * 生成国际化文件（Vue 和 React 通用）
 * @param config 项目配置
 * @param targetDir 目标目录
 * @param framework 框架类型（vue 或 react）
 */
export function generateLocaleFiles(
  config: ProjectConfig,
  targetDir: string,
  framework: 'vue' | 'react',
): void {
  if (!config.i18n) {
    return
  }

  // locales/index.ts
  copyAndRenderTemplate(
    `${framework}/src/locales/index.ts.ejs`,
    join(targetDir, 'src/locales/index.ts'),
    config,
  )

  // 语言文件
  const langs = ['zh', 'en', 'es']
  langs.forEach((lang) => {
    copyAndRenderTemplate(
      `${framework}/src/locales/lang/${lang}.ts.ejs`,
      join(targetDir, `src/locales/lang/${lang}.ts`),
      config,
    )
  })
}

/**
 * 生成工具文件（Vue 和 React 通用）
 * @param config 项目配置
 * @param targetDir 目标目录
 * @param framework 框架类型（vue 或 react）
 */
export function generateUtilsFiles(
  config: ProjectConfig,
  targetDir: string,
  framework: 'vue' | 'react',
): void {
  // utils/index.ts
  copyAndRenderTemplate(
    `${framework}/src/utils/index.ts.ejs`,
    join(targetDir, 'src/utils/index.ts'),
    config,
  )

  // utils/sentry.ts（如果启用 Sentry）
  if (config.sentry) {
    copyAndRenderTemplate(
      `${framework}/src/utils/sentry.ts.ejs`,
      join(targetDir, 'src/utils/sentry.ts'),
      config,
    )
  }
}

/**
 * 生成 .env 文件
 * @param config 项目配置
 * @param targetDir 目标目录
 * @param framework 框架类型（vue 或 react）
 */
export function generateEnvFile(
  config: ProjectConfig,
  targetDir: string,
  framework: 'vue' | 'react',
): void {
  try {
    copyAndRenderTemplate(
      `${framework}/env.ejs`,
      join(targetDir, '.env'),
      config,
    )
  }
  catch {
    // 如果模板不存在，创建一个简单的 .env
    const envContent = `# 项目标题
VITE_APP_TITLE=${config.projectName}

# 项目 code（用于路由 base 和 qiankun）
VITE_APP_CODE=/${config.projectName}

# 项目端口
VITE_APP_PORT=5173

# API 基础 URL
VITE_API_BASE_URL=/api
${config.sentry ? '\n# Sentry DSN（仅在生产环境配置）\n# VITE_SENTRY=https://xxx@xxx.ingest.sentry.io/xxx\n\n# 应用版本号（用于 Sentry 追踪）\n# VITE_APP_VERSION=1.0.0' : ''}
`
    writeFile(join(targetDir, '.env'), envContent)
  }
}

/**
 * 创建源代码基础目录结构
 * @param srcDir src 目录路径
 * @param dirs 需要创建的目录列表
 */
export function createSrcDirs(srcDir: string, dirs: string[]): void {
  dirs.forEach((dir) => {
    createDir(join(srcDir, dir))
  })
}
