/**
 * Vue 项目生成器
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
 * 生成 Vue 项目
 */
export async function generateVueProject(config: ProjectConfigType): Promise<void> {
  const { targetDir } = config
  const templatesDir = getTemplatesDir()

  // 1. 渲染 L0 公共基础模板
  renderTemplate(path.join(templatesDir, 'common', 'base'), targetDir)

  // 2. 渲染公共特性模板
  if (config.gitHooks) {
    renderTemplate(path.join(templatesDir, 'common', 'features', 'husky'), targetDir)
  }

  // 3. 渲染 L1 Vue 基础模板
  renderTemplate(path.join(templatesDir, 'vue', 'base'), targetDir)

  // 4. 渲染 L2 特性模板
  renderTemplate(path.join(templatesDir, 'vue', 'features', 'router'), targetDir)
  renderTemplate(path.join(templatesDir, 'vue', 'features', 'pinia'), targetDir)

  // 根据路由模式渲染对应模板
  if (config.routeMode === 'manual') {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'manualRoutes'), targetDir)
  }

  if (config.eslint) {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'eslint'), targetDir)
  }

  if (config.i18n) {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'i18n'), targetDir)
  }

  if (config.sentry) {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'sentry'), targetDir)
  }

  if (config.qiankun) {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'qiankun'), targetDir)
  }

  if (config.routeMode === 'file-system') {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'pageRoutes'), targetDir)
  }

  if (config.uiLibrary === 'element-plus') {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'element-plus'), targetDir)
  }
  else if (config.uiLibrary === 'ant-design-vue') {
    renderTemplate(path.join(templatesDir, 'vue', 'features', 'ant-design-vue'), targetDir)
  }

  // 5. 渲染 EJS 模板（main.ts, router/index.ts）
  const ejsData = {
    i18n: config.i18n,
    sentry: config.sentry,
    qiankun: config.qiankun,
    routeMode: config.routeMode,
    uiLibrary: config.uiLibrary,
  }

  renderEjsToFile(
    path.join(templatesDir, 'vue', 'base', 'src', 'main.ts.ejs'),
    path.join(targetDir, 'src', 'main.ts'),
    ejsData,
  )

  renderEjsToFile(
    path.join(templatesDir, 'vue', 'base', 'src', 'router', 'index.ts.ejs'),
    path.join(targetDir, 'src', 'router', 'index.ts'),
    ejsData,
  )

  // 6. 数据驱动生成 vite.config.ts
  const viteConfigContent = renderViteConfig(config)
  fs.writeFileSync(path.join(targetDir, 'vite.config.ts'), viteConfigContent)
}
