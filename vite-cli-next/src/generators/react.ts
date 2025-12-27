/**
 * React 项目生成器
 * 采用物理路径合并 + EJS 模板 + 数据驱动配置
 */

import type { ProjectConfigType } from '../types'

import fs from 'node:fs'
import path from 'node:path'

import { renderEjsToFile } from '../utils/ejs'
import { getTemplatesDir } from '../utils/file'
import { renderTemplate } from '../utils/renderTemplate'
import { renderViteConfig } from '../utils/viteConfigRender'

/**
 * 生成 React 项目
 */
export async function generateReactProject(config: ProjectConfigType): Promise<void> {
  const { targetDir } = config
  const templatesDir = getTemplatesDir()

  // 1. 渲染 L0 公共基础模板
  renderTemplate(path.join(templatesDir, 'common', 'base'), targetDir)

  // 2. 渲染公共特性模板
  if (config.gitHooks) {
    renderTemplate(path.join(templatesDir, 'common', 'features', 'husky'), targetDir)
  }

  // 3. 渲染 L1 React 基础模板
  renderTemplate(path.join(templatesDir, 'react', 'base'), targetDir)

  // 4. 渲染 L2 特性模板
  renderTemplate(path.join(templatesDir, 'react', 'features', 'router'), targetDir)
  renderTemplate(path.join(templatesDir, 'react', 'features', 'zustand'), targetDir)

  // 根据路由模式渲染对应模板
  if (config.routeMode === 'manual') {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'manualRoutes'), targetDir)
  }

  if (config.eslint) {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'eslint'), targetDir)
  }

  if (config.i18n) {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'i18n'), targetDir)
  }

  if (config.sentry) {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'sentry'), targetDir)
  }

  if (config.routeMode === 'file-system') {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'pageRoutes'), targetDir)
  }

  if (config.uiLibrary === 'ant-design') {
    renderTemplate(path.join(templatesDir, 'react', 'features', 'ant-design'), targetDir)
  }

  // 5. 渲染 EJS 模板（main.tsx, router/index.tsx）
  const ejsData = {
    i18n: config.i18n,
    sentry: config.sentry,
    routeMode: config.routeMode,
    uiLibrary: config.uiLibrary,
  }

  renderEjsToFile(
    path.join(templatesDir, 'react', 'base', 'src', 'main.tsx.ejs'),
    path.join(targetDir, 'src', 'main.tsx'),
    ejsData,
  )

  renderEjsToFile(
    path.join(templatesDir, 'react', 'base', 'src', 'router', 'index.tsx.ejs'),
    path.join(targetDir, 'src', 'router', 'index.tsx'),
    ejsData,
  )

  // 6. 数据驱动生成 vite.config.ts
  const viteConfigContent = renderViteConfig(config)
  fs.writeFileSync(path.join(targetDir, 'vite.config.ts'), viteConfigContent)
}
