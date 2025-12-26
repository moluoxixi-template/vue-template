/**
 * Vue 项目生成器
 * 生成 Vue 3 项目结构
 */

import type { ProjectConfigType } from '../types'
import path from 'node:path'
import {
  getMainTsExtensions,
  getViteConfigExtensions,
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
 * 生成 Vue 项目
 */
export async function generateVueProject(config: ProjectConfigType): Promise<void> {
  const { targetDir } = config
  const templatesDir = getTemplatesDir()

  // 1. 复制 L0 base 模板
  await copyL0Templates(templatesDir, targetDir)

  // 2. 复制 L1 Vue base 模板
  await copyL1Templates(templatesDir, targetDir, config)

  // 3. 生成 package.json (合并)
  generatePackageJsonFile(config, targetDir)

  // 4. 生成 pnpm-workspace.yaml (合并)
  generatePnpmWorkspaceFile(config, targetDir)

  // 5. 生成 vite.config.ts (合并配置)
  generateViteConfigFile(config, targetDir, templatesDir)

  // 6. 生成 main.ts (合并配置)
  generateMainTsFile(config, targetDir, templatesDir)

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
 * 复制 L1 Vue 基础模板
 */
async function copyL1Templates(
  templatesDir: string,
  targetDir: string,
  config: ProjectConfigType,
): Promise<void> {
  const l1Dir = path.join(templatesDir, 'vue', 'base')
  const files = getFiles(l1Dir)

  // 需要跳过的文件（单独处理）
  const skipPatterns = [
    'package.json',
    'pnpm-workspace.yaml',
    'vite.config.ts',
    'src/main.ts',
    'src/locales/index.ts',
    'src/utils/sentry.ts',
    'src/router/index.ts',
  ]

  for (const file of files) {
    const relativePath = getRelativePath(l1Dir, file)

    // 跳过 .ejs 模板文件（不直接复制）
    if (file.endsWith('.ejs')) {
      continue
    }

    // 跳过需要单独处理的文件
    if (skipPatterns.some(pattern => relativePath.includes(pattern))) {
      continue
    }

    // 跳过 Element Plus 样式目录（非 element-plus UI 库时）
    if (relativePath.includes('element') && config.uiLibrary !== 'element-plus') {
      continue
    }

    // 跳过 SubMenu 组件（非 element-plus UI 库时）
    if (relativePath.includes('SubMenu') && config.uiLibrary !== 'element-plus') {
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
  const basePath = path.join(templatesDir, 'vue', 'base', 'vite.config.ts')
  let content = readFile(basePath)

  const { imports, plugins, configOverrides } = getViteConfigExtensions(config)

  // 添加导入语句
  if (imports.length > 0) {
    const importStatements = imports
      .map(([id, mod]) => `import { ${id} } from '${mod}'`)
      .join('\n')
    content = content.replace(
      'import { loadEnv } from \'vite\'',
      `${importStatements}\nimport { loadEnv } from 'vite'`,
    )
  }

  // 添加插件
  if (plugins.length > 0) {
    const pluginStr = plugins.map(p => `          ${p},`).join('\n')
    content = content.replace(
      'plugins: [],',
      `plugins: [\n${pluginStr}\n        ],`,
    )
  }

  // 添加 pageRoutes 配置
  if (configOverrides.pageRoutes) {
    content = content.replace(
      'autoComponent: true,',
      'autoComponent: true,\n      pageRoutes: true,',
    )
  }

  // Element Plus 样式处理
  if (config.uiLibrary === 'element-plus') {
    content = content.replace(
      'api: \'modern-compiler\',',
      `api: 'modern-compiler',
              additionalData: (source: string, filename: string) => {
                if (filename.includes('assets/styles/element/index.scss')) {
                  return \`$namespace: '\${appCode || 'el'}';
                \${source}\`
                }
                return source
              },`,
    )
  }

  writeFile(path.join(targetDir, 'vite.config.ts'), content)
}

/**
 * 生成 main.ts
 */
function generateMainTsFile(
  config: ProjectConfigType,
  targetDir: string,
): void {
  const { imports, appUse, afterRouter, styleImports } = getMainTsExtensions(config)

  // 构建 main.ts 内容
  let content = `/**
 * 应用入口文件
 * 初始化 Vue 应用并挂载到 DOM
 */

`

  // qiankun 支持
  if (config.qiankun) {
    content += `import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
`
  }

  content += `import { createApp } from 'vue'
import directives from '@/directives'
`

  // 添加特性导入
  for (const imp of imports) {
    content += `${imp}\n`
  }

  content += `import { store } from '@/stores'
import App from './App.vue'
import getRouter from './router'

// 导入样式文件
`

  // 添加样式导入
  for (const style of styleImports) {
    content += `${style}\n`
  }

  content += `import '@/assets/styles/main.scss'
import '@/assets/fonts/index.css'

`

  if (config.qiankun) {
    content += `let app: ReturnType<typeof createApp> | null = null

async function render(props: QiankunProps = {}): Promise<void> {
  const { container } = props
  app = createApp(App)

  directives(app)
  const router = getRouter(props)

`
    // afterRouter hooks
    for (const hook of afterRouter) {
      content += `  ${hook}\n`
    }

    content += `
  app.use(store)
`
    // appUse hooks
    for (const use of appUse) {
      content += `  ${use}\n`
    }

    content += `  app.use(router)
  app.config.warnHandler = () => null

  if (container) {
    const root = container.querySelector('#app')
    app.mount(root)
  } else {
    app.mount('#app')
  }
}

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
} else {
  renderWithQiankun({
    async mount(props: QiankunProps) {
      await render(props)
    },
    bootstrap() {},
    unmount() {
      app?.unmount()
      app = null
    },
    update() {},
  })
}
`
  }
  else {
    content += `const app = createApp(App)

directives(app)
const router = getRouter({})

`
    // afterRouter hooks
    for (const hook of afterRouter) {
      content += `${hook}\n`
    }

    content += `
app.use(store)
`
    // appUse hooks
    for (const use of appUse) {
      content += `${use}\n`
    }

    content += `app.use(router)
app.config.warnHandler = () => null

app.mount('#app')
`
  }

  writeFile(path.join(targetDir, 'src', 'main.ts'), content)
}

/**
 * 生成条件文件
 */
function generateConditionalFiles(
  config: ProjectConfigType,
  targetDir: string,
  templatesDir: string,
): void {
  const vueBaseDir = path.join(templatesDir, 'vue', 'base')

  // router/index.ts
  const routerContent = generateRouterFile(config)
  writeFile(path.join(targetDir, 'src', 'router', 'index.ts'), routerContent)

  // 手动路由模式需要 routes.ts
  if (config.routeMode === 'manual') {
    const routesPath = path.join(vueBaseDir, 'src', 'router', 'routes.ts')
    if (pathExists(routesPath)) {
      copyFile(routesPath, path.join(targetDir, 'src', 'router', 'routes.ts'))
    }
  }

  // i18n
  if (config.i18n) {
    const localesPath = path.join(vueBaseDir, 'src', 'locales', 'index.ts')
    if (pathExists(localesPath)) {
      const content = readFile(localesPath)
      writeFile(path.join(targetDir, 'src', 'locales', 'index.ts'), content)
    }
  }
  else {
    createDir(path.join(targetDir, 'src', 'locales'))
  }

  // sentry
  if (config.sentry) {
    const sentryPath = path.join(vueBaseDir, 'src', 'utils', 'sentry.ts')
    if (pathExists(sentryPath)) {
      const content = readFile(sentryPath)
      writeFile(path.join(targetDir, 'src', 'utils', 'sentry.ts'), content)
    }
  }

  // Element Plus 样式
  if (config.uiLibrary === 'element-plus') {
    const elementStylePath = path.join(vueBaseDir, 'src', 'assets', 'styles', 'element', 'index.scss')
    if (pathExists(elementStylePath)) {
      createDir(path.join(targetDir, 'src', 'assets', 'styles', 'element'))
      copyFile(elementStylePath, path.join(targetDir, 'src', 'assets', 'styles', 'element', 'index.scss'))
    }
  }
}

/**
 * 生成 router/index.ts 内容
 */
function generateRouterFile(config: ProjectConfigType): string {
  let content = `/**
 * 路由配置
 */

`

  if (config.qiankun) {
    content += `import type { QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
`
  }

  content += `import { createRouter, createWebHistory } from 'vue-router'
`

  if (config.routeMode === 'file-system') {
    content += `import routes from '~pages'
`
  }
  else {
    content += `import routes from './routes'
`
  }

  content += `
`

  if (config.qiankun) {
    content += `export default function getRouter(props: QiankunProps = {}) {
  const router = createRouter({
    history: createWebHistory(
      qiankunWindow.__POWERED_BY_QIANKUN__
        ? '/sub-app/'
        : import.meta.env.BASE_URL
    ),
    routes,
  })

  return router
}
`
  }
  else {
    content += `export default function getRouter(_props: Record<string, unknown> = {}) {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

  return router
}
`
  }

  return content
}
