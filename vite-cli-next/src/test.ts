/**
 * 测试脚本
 * 生成验收样本并进行产物审计
 */

import type { ProjectConfigType } from './types'

import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import fs from 'fs-extra'

import { generateProject } from './generators/project'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 测试输出目录 */
const TEST_OUTPUT_DIR = path.resolve(__dirname, '../test')

/** 测试配置矩阵 */
const TEST_CONFIGS: Array<{ name: string, config: Partial<ProjectConfigType> }> = [
  // Vue 基础配置组合
  {
    name: 'vue-element-basic',
    config: {
      projectName: 'vue-element-basic',
      description: 'Vue + Element Plus 基础项目',
      author: 'test',
      framework: 'vue',
      uiLibrary: 'element-plus',
      routeMode: 'manual',
      i18n: true,
      qiankun: false,
      sentry: false,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'vue-element-full',
    config: {
      projectName: 'vue-element-full',
      description: 'Vue + Element Plus 全量特性项目',
      author: 'test',
      framework: 'vue',
      uiLibrary: 'element-plus',
      routeMode: 'file-system',
      i18n: true,
      qiankun: true,
      sentry: true,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'vue-antd-basic',
    config: {
      projectName: 'vue-antd-basic',
      description: 'Vue + Ant Design Vue 基础项目',
      author: 'test',
      framework: 'vue',
      uiLibrary: 'ant-design-vue',
      routeMode: 'manual',
      i18n: true,
      qiankun: false,
      sentry: false,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'vue-antd-minimal',
    config: {
      projectName: 'vue-antd-minimal',
      description: 'Vue + Ant Design Vue 最小配置（无 i18n）',
      author: 'test',
      framework: 'vue',
      uiLibrary: 'ant-design-vue',
      routeMode: 'manual',
      i18n: false,
      qiankun: false,
      sentry: false,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'vue-element-sentry-only',
    config: {
      projectName: 'vue-element-sentry-only',
      description: 'Vue + Element Plus + Sentry（无其他特性）',
      author: 'test',
      framework: 'vue',
      uiLibrary: 'element-plus',
      routeMode: 'manual',
      i18n: false,
      qiankun: false,
      sentry: true,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'vue-no-eslint-no-hooks',
    config: {
      projectName: 'vue-no-eslint-no-hooks',
      description: 'Vue 项目（无 ESLint，无 Git Hooks）',
      author: 'test',
      framework: 'vue',
      uiLibrary: 'element-plus',
      routeMode: 'manual',
      i18n: false,
      qiankun: false,
      sentry: false,
      eslint: false,
      gitHooks: false,
      packageManager: 'pnpm',
    },
  },
  // React 配置组合
  {
    name: 'react-antd-basic',
    config: {
      projectName: 'react-antd-basic',
      description: 'React + Ant Design 基础项目',
      author: 'test',
      framework: 'react',
      uiLibrary: 'ant-design',
      routeMode: 'manual',
      i18n: true,
      qiankun: false,
      sentry: false,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'react-antd-full',
    config: {
      projectName: 'react-antd-full',
      description: 'React + Ant Design 全量特性项目',
      author: 'test',
      framework: 'react',
      uiLibrary: 'ant-design',
      routeMode: 'file-system',
      i18n: true,
      qiankun: false,
      sentry: true,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'react-antd-minimal',
    config: {
      projectName: 'react-antd-minimal',
      description: 'React + Ant Design 最小配置（无 i18n, 无 sentry）',
      author: 'test',
      framework: 'react',
      uiLibrary: 'ant-design',
      routeMode: 'manual',
      i18n: false,
      qiankun: false,
      sentry: false,
      eslint: true,
      gitHooks: true,
      packageManager: 'pnpm',
    },
  },
  {
    name: 'react-no-eslint-no-hooks',
    config: {
      projectName: 'react-no-eslint-no-hooks',
      description: 'React 项目（无 ESLint，无 Git Hooks）',
      author: 'test',
      framework: 'react',
      uiLibrary: 'ant-design',
      routeMode: 'manual',
      i18n: false,
      qiankun: false,
      sentry: false,
      eslint: false,
      gitHooks: false,
      packageManager: 'pnpm',
    },
  },
]

/**
 * 生成测试项目
 */
async function generateTestProjects(): Promise<void> {
  console.log(chalk.blue.bold('\n🧪 开始生成测试项目...\n'))

  // 清理并创建测试目录
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.removeSync(TEST_OUTPUT_DIR)
  }
  fs.ensureDirSync(TEST_OUTPUT_DIR)

  for (const { name, config } of TEST_CONFIGS) {
    console.log(chalk.cyan(`📦 生成 ${name}...`))

    const fullConfig: ProjectConfigType = {
      projectName: config.projectName!,
      description: config.description!,
      author: config.author!,
      framework: config.framework!,
      uiLibrary: config.uiLibrary!,
      routeMode: config.routeMode!,
      i18n: config.i18n!,
      qiankun: config.qiankun!,
      sentry: config.sentry!,
      eslint: config.eslint!,
      gitHooks: config.gitHooks!,
      packageManager: config.packageManager!,
      targetDir: path.join(TEST_OUTPUT_DIR, name),
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
 * 审计 @moluoxixi 依赖
 */
async function auditMoluoxixiDeps(): Promise<void> {
  console.log(chalk.blue.bold('\n🔍 开始审计 @moluoxixi 依赖...\n'))

  const requiredDeps = [
    '@moluoxixi/vite-config',
    '@moluoxixi/ajax-package',
  ]

  let hasError = false

  for (const { name, config } of TEST_CONFIGS) {
    const projectDir = path.join(TEST_OUTPUT_DIR, name)
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

  for (const { name } of TEST_CONFIGS) {
    const projectDir = path.join(TEST_OUTPUT_DIR, name)
    console.log(chalk.cyan(`\n${name}/`))
    await printFileTree(projectDir, '  ')
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
