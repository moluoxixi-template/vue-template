/**
 * Vue 项目生成器
 * 生成 Vue 3 项目结构
 */

import type { ProjectConfigType, TemplateContextType } from '../types'
import path from 'node:path'
import { generatePackageJson } from '../renderers/package-json'
import { generatePnpmWorkspace } from '../renderers/pnpm-workspace'
import { getViteConfigContext } from '../renderers/vite-config'
import {
  copyAndRenderTemplate,
  copyStaticFile,
  createDir,
  getFiles,
  getRelativePath,
  getRenderedFileName,
  getTemplatesDir,
  isEjsTemplate,
  writeFile,
  writeJsonFile,
} from '../utils'

/**
 * 生成 Vue 项目
 * @param config 项目配置
 */
export async function generateVueProject(config: ProjectConfigType): Promise<void> {
  const { targetDir } = config
  const context = createTemplateContext(config)

  // 1. 复制 L0 基础模板
  await copyL0Templates(targetDir, context)

  // 2. 复制 L1 Vue 基础模板
  await copyL1VueTemplates(targetDir, context)

  // 3. 生成 package.json（深度合并）
  generatePackageJsonFile(config, targetDir)

  // 4. 生成 pnpm-workspace.yaml
  generatePnpmWorkspaceFile(config, targetDir)

  // 5. 生成 vite.config.ts（EJS 渲染）
  generateViteConfigFile(config, targetDir)

  // 6. 生成 main.ts（EJS 渲染）
  generateMainTsFile(config, targetDir)

  // 7. 生成 router/index.ts（EJS 渲染）
  generateRouterFile(config, targetDir)

  // 8. 处理条件文件（i18n、sentry 等）
  generateConditionalFiles(config, targetDir, context)
}

/**
 * 创建模板上下文
 * @param config 项目配置
 */
function createTemplateContext(config: ProjectConfigType): TemplateContextType {
  const viteContext = getViteConfigContext(config)
  return {
    ...viteContext,
    // 配置简写
    config,
  } as TemplateContextType
}

/**
 * 复制 L0 基础模板
 * @param targetDir 目标目录
 * @param context 模板上下文
 */
async function copyL0Templates(
  targetDir: string,
  context: TemplateContextType,
): Promise<void> {
  const l0Dir = path.join(getTemplatesDir(), 'base')
  const files = getFiles(l0Dir)

  for (const file of files) {
    const relativePath = getRelativePath(l0Dir, file)
    const targetPath = path.join(targetDir, getRenderedFileName(relativePath))

    // 跳过数据文件
    if (relativePath.endsWith('.data.ts')) {
      continue
    }

    if (isEjsTemplate(file)) {
      copyAndRenderTemplate(`base/${relativePath}`, targetPath, context)
    }
    else {
      copyStaticFile(`base/${relativePath}`, targetPath)
    }
  }
}

/**
 * 复制 L1 Vue 基础模板
 * @param targetDir 目标目录
 * @param context 模板上下文
 */
async function copyL1VueTemplates(
  targetDir: string,
  context: TemplateContextType,
): Promise<void> {
  const l1Dir = path.join(getTemplatesDir(), 'vue/base')
  const files = getFiles(l1Dir)

  // 需要跳过的文件（单独处理）
  const skipFiles = [
    'package.json.data.ts',
    'pnpm-workspace.data.ts',
    'vite.config.ts.ejs',
    'main.ts.ejs',
    'src/router/index.ts.ejs',
    'src/locales/index.ts.ejs',
    'src/utils/sentry.ts.ejs',
  ]

  for (const file of files) {
    const relativePath = getRelativePath(l1Dir, file)

    // 跳过需要单独处理的文件
    if (skipFiles.some(skip => relativePath.includes(skip))) {
      continue
    }

    const targetPath = path.join(targetDir, getRenderedFileName(relativePath))

    if (isEjsTemplate(file)) {
      copyAndRenderTemplate(`vue/base/${relativePath}`, targetPath, context)
    }
    else {
      copyStaticFile(`vue/base/${relativePath}`, targetPath)
    }
  }
}

/**
 * 生成 package.json 文件
 * @param config 项目配置
 * @param targetDir 目标目录
 */
function generatePackageJsonFile(config: ProjectConfigType, targetDir: string): void {
  const packageJson = generatePackageJson(config)
  writeJsonFile(path.join(targetDir, 'package.json'), packageJson)
}

/**
 * 生成 pnpm-workspace.yaml 文件
 * @param config 项目配置
 * @param targetDir 目标目录
 */
function generatePnpmWorkspaceFile(config: ProjectConfigType, targetDir: string): void {
  const content = generatePnpmWorkspace(config)
  writeFile(path.join(targetDir, 'pnpm-workspace.yaml'), content)
}

/**
 * 生成 vite.config.ts 文件
 * @param config 项目配置
 * @param targetDir 目标目录
 */
function generateViteConfigFile(config: ProjectConfigType, targetDir: string): void {
  const context = getViteConfigContext(config)
  copyAndRenderTemplate(
    'vue/base/vite.config.ts.ejs',
    path.join(targetDir, 'vite.config.ts'),
    context,
  )
}

/**
 * 生成 main.ts 文件
 * @param config 项目配置
 * @param targetDir 目标目录
 */
function generateMainTsFile(config: ProjectConfigType, targetDir: string): void {
  const context = createTemplateContext(config)
  copyAndRenderTemplate(
    'vue/base/main.ts.ejs',
    path.join(targetDir, 'src/main.ts'),
    context,
  )
}

/**
 * 生成路由文件
 * @param config 项目配置
 * @param targetDir 目标目录
 */
function generateRouterFile(config: ProjectConfigType, targetDir: string): void {
  const context = createTemplateContext(config)
  copyAndRenderTemplate(
    'vue/base/src/router/index.ts.ejs',
    path.join(targetDir, 'src/router/index.ts'),
    context,
  )

  // 手动路由模式需要复制 routes.ts
  if (config.routeMode === 'manual') {
    copyStaticFile(
      'vue/base/src/router/routes.ts',
      path.join(targetDir, 'src/router/routes.ts'),
    )
  }
}

/**
 * 生成条件文件
 * @param config 项目配置
 * @param targetDir 目标目录
 * @param context 模板上下文
 */
function generateConditionalFiles(
  config: ProjectConfigType,
  targetDir: string,
  context: TemplateContextType,
): void {
  // i18n 相关文件
  if (config.i18n) {
    copyAndRenderTemplate(
      'vue/base/src/locales/index.ts.ejs',
      path.join(targetDir, 'src/locales/index.ts'),
      context,
    )
  }
  else {
    // 不需要 i18n 时，创建空的 locales 目录
    createDir(path.join(targetDir, 'src/locales'))
  }

  // Sentry 相关文件
  if (config.sentry) {
    copyAndRenderTemplate(
      'vue/base/src/utils/sentry.ts.ejs',
      path.join(targetDir, 'src/utils/sentry.ts'),
      context,
    )
  }

  // Element Plus 样式
  if (config.uiLibrary === 'element-plus') {
    createDir(path.join(targetDir, 'src/assets/styles/element'))
    copyStaticFile(
      'vue/base/src/assets/styles/element/index.scss',
      path.join(targetDir, 'src/assets/styles/element/index.scss'),
    )
  }
}
