/**
 * React 项目生成器
 * 生成 React 项目结构
 */

import type { ProjectConfigType } from '../types'
import path from 'node:path'
import {
  mergePackageJson,
  mergePnpmWorkspace,
} from '../utils/merge'
import {
  copyFile,
  createDir,
  getFiles,
  getRelativePath,
  getTemplatesDir,
  pathExists,
  readFile,
  writeFile,
  writeJsonFile,
} from '../utils/file'

/**
 * 生成 React 项目
 */
export async function generateReactProject(config: ProjectConfigType): Promise<void> {
  const { targetDir } = config
  const templatesDir = getTemplatesDir()

  // 1. 复制 L0 base 模板
  await copyL0Templates(templatesDir, targetDir)

  // 2. 复制 L1 React base 模板
  await copyL1Templates(templatesDir, targetDir, config)

  // 3. 生成 package.json (合并)
  generatePackageJsonFile(config, targetDir)

  // 4. 生成 pnpm-workspace.yaml (合并)
  generatePnpmWorkspaceFile(config, targetDir)

  // 5. 生成 vite.config.ts
  generateViteConfigFile(config, targetDir, templatesDir)

  // 6. 生成 main.tsx
  generateMainTsxFile(config, targetDir)

  // 7. 处理条件文件
  generateConditionalFiles(config, targetDir, templatesDir)
}

/**
 * 复制 L0 基础模板
 */
async function copyL0Templates(templatesDir: string, targetDir: string): Promise<void> {
  const l0Dir = path.join(templatesDir, 'base')
  const files = getFiles(l0Dir)

  for (const file of files) {
    const relativePath = getRelativePath(l0Dir, file)
    const targetPath = path.join(targetDir, relativePath)
    copyFile(file, targetPath)
  }
}

/**
 * 复制 L1 React 基础模板
 */
async function copyL1Templates(
  templatesDir: string,
  targetDir: string,
): Promise<void> {
  const l1Dir = path.join(templatesDir, 'react', 'base')
  const files = getFiles(l1Dir)

  // 需要跳过的文件
  const skipPatterns = [
    'package.json',
    'pnpm-workspace.yaml',
    'vite.config.ts',
    'src/main.tsx',
    'src/locales/index.ts',
    'src/utils/sentry.ts',
  ]

  for (const file of files) {
    const relativePath = getRelativePath(l1Dir, file)

    if (skipPatterns.some(pattern => relativePath.includes(pattern))) {
      continue
    }

    const targetPath = path.join(targetDir, relativePath)
    copyFile(file, targetPath)
  }
}

/**
 * 生成 package.json
 */
function generatePackageJsonFile(config: ProjectConfigType, targetDir: string): void {
  const packageJson = mergePackageJson(config)
  writeJsonFile(path.join(targetDir, 'package.json'), packageJson)
}

/**
 * 生成 pnpm-workspace.yaml
 */
function generatePnpmWorkspaceFile(config: ProjectConfigType, targetDir: string): void {
  const content = mergePnpmWorkspace(config)
  writeFile(path.join(targetDir, 'pnpm-workspace.yaml'), content)
}

/**
 * 生成 vite.config.ts
 */
function generateViteConfigFile(
  config: ProjectConfigType,
  targetDir: string,
  templatesDir: string,
): void {
  const basePath = path.join(templatesDir, 'react', 'base', 'vite.config.ts')
  let content = readFile(basePath)

  // Sentry 插件
  if (config.sentry) {
    content = content.replace(
      'import { loadEnv } from \'vite\'',
      `import { sentryVitePlugin } from '@sentry/vite-plugin'\nimport { loadEnv } from 'vite'`,
    )
    content = content.replace(
      'react(),',
      `react(),
          viteEnv.VITE_SENTRY && mode === 'production' && sentryVitePlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: 'f1f562b9b82f',
            project: 'javascript-react',
            sourcemaps: {
              assets: './dist/**',
              ignore: ['node_modules'],
            },
            release: {
              name: viteEnv.VITE_APP_VERSION || 'unknown',
            },
          }),`,
    )
  }

  writeFile(path.join(targetDir, 'vite.config.ts'), content)
}

/**
 * 生成 main.tsx
 */
function generateMainTsxFile(config: ProjectConfigType, targetDir: string): void {
  let content = `/**
 * 应用入口文件
 * 初始化 React 应用并挂载到 DOM
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
`

  // i18n
  if (config.i18n) {
    content += `import '@/locales'
`
  }

  // Sentry
  if (config.sentry) {
    content += `import { initSentry } from '@/utils/sentry'
`
  }

  content += `import App from './App'

// 导入样式文件
`

  // Ant Design 样式
  if (config.uiLibrary === 'ant-design') {
    content += `import 'antd/dist/reset.css'
`
  }

  content += `import '@/assets/styles/main.scss'
import '@/assets/fonts/index.css'

`

  // 初始化 Sentry
  if (config.sentry) {
    content += `// 初始化 Sentry
initSentry()

`
  }

  content += `ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
`

  writeFile(path.join(targetDir, 'src', 'main.tsx'), content)
}

/**
 * 生成条件文件
 */
function generateConditionalFiles(
  config: ProjectConfigType,
  targetDir: string,
  templatesDir: string,
): void {
  const reactBaseDir = path.join(templatesDir, 'react', 'base')

  // i18n
  if (config.i18n) {
    const localesPath = path.join(reactBaseDir, 'src', 'locales', 'index.ts')
    if (pathExists(localesPath)) {
      createDir(path.join(targetDir, 'src', 'locales'))
      copyFile(localesPath, path.join(targetDir, 'src', 'locales', 'index.ts'))
    }
  }

  // sentry
  if (config.sentry) {
    const sentryPath = path.join(reactBaseDir, 'src', 'utils', 'sentry.ts')
    if (pathExists(sentryPath)) {
      const content = readFile(sentryPath)
      writeFile(path.join(targetDir, 'src', 'utils', 'sentry.ts'), content)
    }
  }
}
