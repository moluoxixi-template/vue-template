/**
 * 沙箱生成脚本
 * 生成测试项目用于代码质量检查
 */

import type { ProjectConfig } from './types'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderProject } from './core/renderer'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = join(__dirname, '..')
const sandboxDir = join(rootDir, 'vite-cli-next-test')

// 清理并生成测试项目（Vue + Router + Pinia + Element Plus + i18n + qiankun）
const testConfig: ProjectConfig = {
  projectName: 'sandbox-test',
  description: 'Sandbox Test Project',
  author: 'vite-cli',
  framework: 'vue',
  uiLibrary: 'element-plus',
  routeMode: 'file-system',
  i18n: true,
  qiankun: true,
  sentry: true,
  packageManager: 'pnpm',
  targetDir: sandboxDir,
}

/**
 * 生成沙箱项目
 */
async function generateSandbox(): Promise<void> {
  console.log('🧹 Cleaning sandbox directory...')
  if (existsSync(sandboxDir)) {
    rmSync(sandboxDir, { recursive: true, force: true })
  }
  mkdirSync(sandboxDir, { recursive: true })

  console.log('🚀 Generating sandbox project...')
  await renderProject(testConfig)
  console.log('✅ Sandbox project generated successfully!')
  console.log(`📁 Output directory: ${sandboxDir}`)
}

generateSandbox().catch(console.error)
