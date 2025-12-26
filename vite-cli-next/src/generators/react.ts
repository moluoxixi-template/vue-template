/**
 * React 项目生成器
 * 采用物理路径合并 + EJS 模板 + 数据驱动配置
 */

import type { ProjectConfigType } from '../types'
import fs from 'node:fs'
import path from 'node:path'
import { renderTemplate } from '../utils/renderTemplate'
import { renderEjsToFile } from '../utils/ejs'
import { renderViteConfig } from '../utils/viteConfigRender'
import { getTemplatesDir } from '../utils/file'

/**
 * 生成 React 项目
 */
export async function generateReactProject(config: ProjectConfigType): Promise<void> {
  const { targetDir } = config
  const templatesDir = getTemplatesDir()

  // 1. 渲染 L0 基础模板
  renderTemplate(path.join(templatesDir, 'base'), targetDir)

  // 2. 渲染 L1 React 基础模板
  renderTemplate(path.join(templatesDir, 'react', 'base'), targetDir)

  // 3. 渲染 L2 特性模板
  renderTemplate(path.join(templatesDir, 'react', 'features', 'router'), targetDir)
  renderTemplate(path.join(templatesDir, 'react', 'features', 'zustand'), targetDir)
  renderTemplate(path.join(templatesDir, 'react', 'features', 'eslint'), targetDir)

  if (config.i18n) {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'i18n'), targetDir)
  }

  if (config.sentry) {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'sentry'), targetDir)
  }

  if (config.uiLibrary === 'ant-design') {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'ant-design'), targetDir)
  }

  // 4. 渲染 EJS 模板（main.tsx）
  const ejsData = {
    i18n: config.i18n,
    sentry: config.sentry,
    uiLibrary: config.uiLibrary,
  }

  renderEjsToFile(
    path.join(templatesDir, 'react', 'base', 'src', 'main.tsx.ejs'),
    path.join(targetDir, 'src', 'main.tsx'),
    ejsData,
  )

  // 5. 数据驱动生成 vite.config.ts
  const viteConfigContent = renderViteConfig(config)
  fs.writeFileSync(path.join(targetDir, 'vite.config.ts'), viteConfigContent)

  // 6. 清理不需要的文件
  cleanupFiles(config, targetDir)
}

/**
 * 清理不需要的文件
 */
function cleanupFiles(config: ProjectConfigType, targetDir: string): void {
  // 如果不启用 i18n，删除 locales/index.ts
  if (!config.i18n) {
    const localesIndex = path.join(targetDir, 'src', 'locales', 'index.ts')
    if (fs.existsSync(localesIndex)) {
      fs.unlinkSync(localesIndex)
    }
  }

  // 如果不启用 sentry，删除 utils/sentry.ts
  if (!config.sentry) {
    const sentryFile = path.join(targetDir, 'src', 'utils', 'sentry.ts')
    if (fs.existsSync(sentryFile)) {
      fs.unlinkSync(sentryFile)
    }
  }
}
