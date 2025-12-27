/**
 * 测试脚本
 * 通过文件系统扫描自动生成所有测试用例组合
 */

import type { ProjectConfigType } from './types'

import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import fs from 'fs-extra'

import { generateProject } from './generators/project'
import { getTemplatesDir } from './utils/file'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 测试输出目录 */
const TEST_OUTPUT_DIR = path.resolve(__dirname, '../test')

/**
 * 扫描框架的 features 目录，获取所有可用的 features
 */
function scanFrameworkFeatures(framework: 'vue' | 'react'): string[] {
  const templatesDir = getTemplatesDir()
  const featuresDir = path.join(templatesDir, framework, 'features')

  if (!fs.existsSync(featuresDir)) {
    return []
  }

  return fs.readdirSync(featuresDir).filter((item) => {
    const itemPath = path.join(featuresDir, item)
    return fs.statSync(itemPath).isDirectory()
  })
}
/**
 * 自动生成测试用例配置
 */
function generateTestConfigs(): Array<{ name: string, config: Partial<ProjectConfigType> }> {
  const configs: Array<{ name: string, config: Partial<ProjectConfigType> }> = []

  // 扫描所有框架
  const frameworks: Array<'vue' | 'react'> = ['vue', 'react']

  for (const framework of frameworks) {
    const features = scanFrameworkFeatures(framework)

    // 确定 UI 库选项
    const uiLibraries: string[] = []
    if (framework === 'vue') {
      if (features.includes('element-plus')) {
        uiLibraries.push('element-plus')
      }
      if (features.includes('ant-design-vue')) {
        uiLibraries.push('ant-design-vue')
      }
    }
    else {
      if (features.includes('ant-design')) {
        uiLibraries.push('ant-design')
      }
    }

    // 如果没有 UI 库，使用默认值
    if (uiLibraries.length === 0) {
      uiLibraries.push(framework === 'vue' ? 'element-plus' : 'ant-design')
    }

    // 包管理器选项,目前仅提供pnpm
    const packageManagers: Array<'pnpm' | 'npm' | 'yarn'> = ['pnpm']

    // 生成关键场景组合
    for (const uiLibrary of uiLibraries) {
      // 1. 最小配置（所有特性关闭）
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-minimal`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-minimal`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 最小配置`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'manual',
          router: false,
          stateManagement: false,
          i18n: false,
          qiankun: false,
          sentry: false,
          eslint: false,
          gitHooks: false,
          packageManager: 'pnpm',
        },
      })

      // 2. 基础配置（基本特性开启）
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-basic`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-basic`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 基础项目`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'manual',
          router: true,
          stateManagement: true,
          i18n: true,
          qiankun: false,
          sentry: false,
          eslint: true,
          gitHooks: true,
          packageManager: 'pnpm',
        },
      })

      // 3. 全量配置（所有特性开启）
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-full`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-full`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 全量特性项目`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'file-system',
          router: true,
          stateManagement: true,
          i18n: true,
          qiankun: framework === 'vue',
          sentry: true,
          eslint: true,
          gitHooks: true,
          packageManager: 'pnpm',
        },
      })

      // 4. 手动路由模式
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-manual-routes`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-manual-routes`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 手动路由模式`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'manual',
          router: true,
          stateManagement: true,
          i18n: true,
          qiankun: false,
          sentry: false,
          eslint: true,
          gitHooks: true,
          packageManager: 'pnpm',
        },
      })

      // 5. 文件系统路由模式
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-file-routes`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-file-routes`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 文件系统路由模式`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'file-system',
          router: true,
          stateManagement: true,
          i18n: true,
          qiankun: false,
          sentry: false,
          eslint: true,
          gitHooks: true,
          packageManager: 'pnpm',
        },
      })

      // 6. 无路由
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-router`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-router`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 无路由`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'manual',
          router: false,
          stateManagement: true,
          i18n: true,
          qiankun: false,
          sentry: false,
          eslint: true,
          gitHooks: true,
          packageManager: 'pnpm',
        },
      })

      // 7. 无状态管理
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-state`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-state`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 无状态管理`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'manual',
          router: true,
          stateManagement: false,
          i18n: true,
          qiankun: false,
          sentry: false,
          eslint: true,
          gitHooks: true,
          packageManager: 'pnpm',
        },
      })

      // 8. 无国际化
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-i18n`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-i18n`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 无国际化`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'manual',
          router: true,
          stateManagement: true,
          i18n: false,
          qiankun: false,
          sentry: false,
          eslint: true,
          gitHooks: true,
          packageManager: 'pnpm',
        },
      })

      // 9. 仅 Sentry
      if (features.includes('sentry')) {
        configs.push({
          name: `${framework}-${uiLibrary.replace(/-/g, '-')}-sentry-only`,
          config: {
            projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-sentry-only`,
            description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 仅 Sentry`,
            author: 'test',
            framework,
            uiLibrary: uiLibrary as any,
            routeMode: 'manual',
            router: true,
            stateManagement: true,
            i18n: false,
            qiankun: false,
            sentry: true,
            eslint: true,
            gitHooks: true,
            packageManager: 'pnpm',
          },
        })
      }

      // 10. 仅 Qiankun (仅 Vue)
      if (framework === 'vue' && features.includes('qiankun')) {
        configs.push({
          name: `${framework}-${uiLibrary.replace(/-/g, '-')}-qiankun-only`,
          config: {
            projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-qiankun-only`,
            description: `Vue + ${uiLibrary} 仅 Qiankun`,
            author: 'test',
            framework,
            uiLibrary: uiLibrary as any,
            routeMode: 'manual',
            router: true,
            stateManagement: true,
            i18n: false,
            qiankun: true,
            sentry: false,
            eslint: true,
            gitHooks: true,
            packageManager: 'pnpm',
          },
        })
      }

      // 11. Sentry + Qiankun (仅 Vue)
      if (framework === 'vue' && features.includes('sentry') && features.includes('qiankun')) {
        configs.push({
          name: `${framework}-${uiLibrary.replace(/-/g, '-')}-sentry-qiankun`,
          config: {
            projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-sentry-qiankun`,
            description: `Vue + ${uiLibrary} Sentry + Qiankun`,
            author: 'test',
            framework,
            uiLibrary: uiLibrary as any,
            routeMode: 'manual',
            router: true,
            stateManagement: true,
            i18n: false,
            qiankun: true,
            sentry: true,
            eslint: true,
            gitHooks: true,
            packageManager: 'pnpm',
          },
        })
      }

      // 12. 无 ESLint 无 Git Hooks
      configs.push({
        name: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-eslint-no-hooks`,
        config: {
          projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-no-eslint-no-hooks`,
          description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 无 ESLint 无 Git Hooks`,
          author: 'test',
          framework,
          uiLibrary: uiLibrary as any,
          routeMode: 'manual',
          router: true,
          stateManagement: true,
          i18n: true,
          qiankun: false,
          sentry: false,
          eslint: false,
          gitHooks: false,
          packageManager: 'pnpm',
        },
      })

      // 13. 不同包管理器
      for (const packageManager of packageManagers.slice(1)) { // 跳过 pnpm（已包含）
        configs.push({
          name: `${framework}-${uiLibrary.replace(/-/g, '-')}-${packageManager}`,
          config: {
            projectName: `${framework}-${uiLibrary.replace(/-/g, '-')}-${packageManager}`,
            description: `${framework === 'vue' ? 'Vue' : 'React'} + ${uiLibrary} 使用 ${packageManager}`,
            author: 'test',
            framework,
            uiLibrary: uiLibrary as any,
            routeMode: 'manual',
            router: true,
            stateManagement: true,
            i18n: true,
            qiankun: false,
            sentry: false,
            eslint: true,
            gitHooks: true,
            packageManager,
          },
        })
      }
    }
  }

  return configs
}

/**
 * 生成测试项目
 */
async function generateTestProjects(): Promise<void> {
  console.log(chalk.blue.bold('\n🧪 开始生成测试项目...\n'))

  // 扫描并生成测试配置
  const TEST_CONFIGS = generateTestConfigs()
  console.log(chalk.cyan(`📋 扫描到 ${TEST_CONFIGS.length} 个测试用例\n`))

  // 清理并创建测试目录
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.removeSync(TEST_OUTPUT_DIR)
  }
  fs.ensureDirSync(TEST_OUTPUT_DIR)

  // 创建 Vue 和 React 子目录
  const vueOutputDir = path.join(TEST_OUTPUT_DIR, 'vue')
  const reactOutputDir = path.join(TEST_OUTPUT_DIR, 'react')
  fs.ensureDirSync(vueOutputDir)
  fs.ensureDirSync(reactOutputDir)

  for (const { name, config } of TEST_CONFIGS) {
    console.log(chalk.cyan(`📦 生成 ${name}...`))

    // 根据框架决定输出目录
    const frameworkOutputDir = config.framework === 'vue' ? vueOutputDir : reactOutputDir

    const fullConfig: ProjectConfigType = {
      projectName: config.projectName!,
      description: config.description!,
      author: config.author!,
      framework: config.framework!,
      uiLibrary: config.uiLibrary!,
      routeMode: config.routeMode!,
      router: config.router ?? true,
      stateManagement: config.stateManagement ?? true,
      i18n: config.i18n!,
      qiankun: config.qiankun!,
      sentry: config.sentry!,
      eslint: config.eslint!,
      gitHooks: config.gitHooks!,
      packageManager: config.packageManager!,
      targetDir: path.join(frameworkOutputDir, name),
    }

    try {
      await generateProject(fullConfig)
      console.log(chalk.green(`  ✅ ${name} 生成成功`))
    }
    catch (error) {
      console.log(chalk.red(`  ❌ ${name} 生成失败:`), error)
    }
  }

  console.log(chalk.green.bold('\n✅ 测试项目生成完成!\n'))
}

/**
 * 检查 package.json 中是否有直接版本号
 */
function checkPackageJsonVersions(projectDir: string): boolean {
  const packageJsonPath = path.join(projectDir, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.log(chalk.red(`  ❌ package.json 不存在`))
    return false
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  let hasError = false

  // 检查 dependencies
  if (packageJson.dependencies) {
    for (const [dep, version] of Object.entries(packageJson.dependencies)) {
      if (typeof version === 'string' && /^[\^~]?\d/.test(version)) {
        console.log(chalk.red(`  ❌ dependencies.${dep}: "${version}" 应该使用 catalog:build`))
        hasError = true
      }
    }
  }

  // 检查 devDependencies
  if (packageJson.devDependencies) {
    for (const [dep, version] of Object.entries(packageJson.devDependencies)) {
      if (typeof version === 'string' && /^[\^~]?\d/.test(version)) {
        console.log(chalk.red(`  ❌ devDependencies.${dep}: "${version}" 应该使用 catalog:dev 或 catalog:type`))
        hasError = true
      }
      // 检查 latest
      if (version === 'latest' && !dep.includes('@moluoxixi')) {
        console.log(chalk.yellow(`  ⚠️  devDependencies.${dep}: "latest" 应该使用 catalog:dev`))
        hasError = true
      }
    }
  }

  if (!hasError) {
    console.log(chalk.green(`  ✅ package.json 版本号检查通过`))
  }

  return !hasError
}

/**
 * 审计 @moluoxixi 依赖
 */
async function auditMoluoxixiDeps(): Promise<void> {
  console.log(chalk.blue.bold('\n🔍 开始审计 @moluoxixi 依赖...\n'))

  const TEST_CONFIGS = generateTestConfigs()
  const requiredDeps = [
    '@moluoxixi/vite-config',
    '@moluoxixi/ajax-package',
  ]

  let hasError = false

  for (const { name, config } of TEST_CONFIGS) {
    // 根据框架决定输出目录
    const frameworkOutputDir = config.framework === 'vue'
      ? path.join(TEST_OUTPUT_DIR, 'vue')
      : path.join(TEST_OUTPUT_DIR, 'react')
    const projectDir = path.join(frameworkOutputDir, name)
    const packageJsonPath = path.join(projectDir, 'package.json')
    const workspacePath = path.join(projectDir, 'pnpm-workspace.yaml')

    console.log(chalk.cyan(`📋 检查 ${name}...`))

    // 根据配置决定需要检查的依赖
    const depsToCheck = [...requiredDeps]
    if (config.eslint) {
      depsToCheck.push('@moluoxixi/eslint-config')
    }

    // 检查 package.json
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = fs.readJsonSync(packageJsonPath)
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      for (const dep of depsToCheck) {
        if (!allDeps[dep]) {
          console.log(chalk.red(`  ❌ package.json 缺少 ${dep}`))
          hasError = true
        }
        else {
          console.log(chalk.green(`  ✅ package.json 包含 ${dep}`))
        }
      }
    }
    else {
      console.log(chalk.red(`  ❌ package.json 不存在`))
      hasError = true
    }

    // 检查 pnpm-workspace.yaml
    if (fs.existsSync(workspacePath)) {
      const workspaceContent = fs.readFileSync(workspacePath, 'utf-8')

      for (const dep of depsToCheck) {
        if (!workspaceContent.includes(dep)) {
          console.log(chalk.red(`  ❌ pnpm-workspace.yaml 缺少 ${dep}`))
          hasError = true
        }
        else {
          console.log(chalk.green(`  ✅ pnpm-workspace.yaml 包含 ${dep}`))
        }
      }
    }
    else {
      console.log(chalk.red(`  ❌ pnpm-workspace.yaml 不存在`))
      hasError = true
    }

    // 检查可选特性文件
    if (!config.eslint) {
      const eslintConfig = path.join(projectDir, 'eslint.config.ts')
      if (fs.existsSync(eslintConfig)) {
        console.log(chalk.red(`  ❌ 不应存在 eslint.config.ts（ESLint 已禁用）`))
        hasError = true
      }
      else {
        console.log(chalk.green(`  ✅ eslint.config.ts 已正确移除`))
      }
    }

    if (!config.gitHooks) {
      const huskyDir = path.join(projectDir, '.husky')
      if (fs.existsSync(huskyDir)) {
        console.log(chalk.red(`  ❌ 不应存在 .husky/ 目录（Git Hooks 已禁用）`))
        hasError = true
      }
      else {
        console.log(chalk.green(`  ✅ .husky/ 目录已正确移除`))
      }
    }

    // 检查 package.json 版本号
    console.log(chalk.cyan(`  🔍 检查 package.json 版本号...`))
    const packageJsonOk = checkPackageJsonVersions(projectDir)
    if (!packageJsonOk) {
      hasError = true
    }

    console.log('')
  }

  if (hasError) {
    console.log(chalk.red.bold('\n❌ 审计失败: 存在问题\n'))
    process.exit(1)
  }
  else {
    console.log(chalk.green.bold('\n✅ 审计通过: 所有检查项均通过\n'))
  }
}

/**
 * 显示文件树
 */
async function showFileTrees(): Promise<void> {
  console.log(chalk.blue.bold('\n📂 项目文件树...\n'))

  const vueOutputDir = path.join(TEST_OUTPUT_DIR, 'vue')
  const reactOutputDir = path.join(TEST_OUTPUT_DIR, 'react')

  // 显示 Vue 项目
  if (fs.existsSync(vueOutputDir)) {
    console.log(chalk.cyan.bold('\n📁 Vue 项目:\n'))
    const vueProjects = fs.readdirSync(vueOutputDir).filter((item) => {
      const itemPath = path.join(vueOutputDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
    for (const projectName of vueProjects) {
      const projectDir = path.join(vueOutputDir, projectName)
      console.log(chalk.cyan(`\n${projectName}/`))
      await printFileTree(projectDir, '  ')
    }
  }

  // 显示 React 项目
  if (fs.existsSync(reactOutputDir)) {
    console.log(chalk.cyan.bold('\n📁 React 项目:\n'))
    const reactProjects = fs.readdirSync(reactOutputDir).filter((item) => {
      const itemPath = path.join(reactOutputDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
    for (const projectName of reactProjects) {
      const projectDir = path.join(reactOutputDir, projectName)
      console.log(chalk.cyan(`\n${projectName}/`))
      await printFileTree(projectDir, '  ')
    }
  }
}

/**
 * 打印文件树
 */
async function printFileTree(dir: string, indent: string): Promise<void> {
  const items = fs.readdirSync(dir).sort()

  for (const item of items) {
    if (item === 'node_modules')
      continue

    const itemPath = path.join(dir, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      console.log(chalk.gray(`${indent}📁 ${item}/`))
      await printFileTree(itemPath, `${indent}  `)
    }
    else {
      console.log(chalk.gray(`${indent}📄 ${item}`))
    }
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  console.log(chalk.blue.bold(`\n${'='.repeat(60)}`))
  console.log(chalk.blue.bold('  Vite CLI Next - 产物审计测试'))
  console.log(chalk.blue.bold('='.repeat(60)))

  // 1. 生成测试项目
  await generateTestProjects()

  // 2. 审计 @moluoxixi 依赖
  await auditMoluoxixiDeps()

  // 3. 显示文件树
  await showFileTrees()

  console.log(chalk.green.bold('\n✅ 全量产物审计完成!\n'))
}

main().catch(console.error)
