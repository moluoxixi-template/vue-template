/**
 * Vue 项目生成器
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
 * 生成 Vue 项目
 */
export async function generateVueProject(config: ProjectConfigType): Promise<void> {
  const { targetDir } = config
  const templatesDir = getTemplatesDir()

  // 1. 渲染 L0 基础模板
  renderTemplate(path.join(templatesDir, 'base'), targetDir)

  // 2. 渲染 L1 Vue 基础模板
  renderTemplate(path.join(templatesDir, 'vue', 'base'), targetDir)

  // 3. 渲染 L2 特性模板
  renderTemplate(path.join(templatesDir, 'vue', 'features', 'router'), targetDir)
  renderTemplate(path.join(templatesDir, 'vue', 'features', 'pinia'), targetDir)
  renderTemplate(path.join(templatesDir, 'vue', 'features', 'eslint'), targetDir)

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

  // 4. 渲染 EJS 模板（main.ts, router/index.ts）
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
  // 如果不是 element-plus，删除 element 相关文件
  if (config.uiLibrary !== 'element-plus') {
    const elementStyleDir = path.join(targetDir, 'src', 'assets', 'styles', 'element')
    if (fs.existsSync(elementStyleDir)) {
      fs.rmSync(elementStyleDir, { recursive: true })
    }

    const subMenuDir = path.join(targetDir, 'src', 'components', 'SubMenu')
    if (fs.existsSync(subMenuDir)) {
      fs.rmSync(subMenuDir, { recursive: true })
    }
  }

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

  // 如果使用文件系统路由，删除手动路由文件
  if (config.routeMode === 'file-system') {
    const routesFile = path.join(targetDir, 'src', 'router', 'routes.ts')
    if (fs.existsSync(routesFile)) {
      fs.unlinkSync(routesFile)
    }

    const layoutVue = path.join(targetDir, 'src', 'router', 'layout.vue')
    if (fs.existsSync(layoutVue)) {
      fs.unlinkSync(layoutVue)
    }
  }
}
