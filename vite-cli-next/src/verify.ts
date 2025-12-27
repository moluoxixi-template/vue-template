/**
 * 验证产物脚本
 * 检查 package.json 和测试运行/打包
 */

import type { ProjectConfigType } from './types'

import fs from 'fs-extra'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'

import { generateProject } from './generators/project'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 测试输出目录 */
const TEST_OUTPUT_DIR = path.resolve(__dirname, '../test-verify')

/** 测试配置 */
const TEST_CONFIG: ProjectConfigType = {
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
  targetDir: path.join(TEST_OUTPUT_DIR, 'vue-element-basic'),
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
 * 主函数
 */
async function main(): Promise<void> {
  console.log(chalk.blue.bold(`\n${'='.repeat(60)}`))
  console.log(chalk.blue.bold('  产物验证测试'))
  console.log(chalk.blue.bold('='.repeat(60)))

  // 清理并创建测试目录
  if (fs.existsSync(TEST_OUTPUT_DIR)) {
    fs.removeSync(TEST_OUTPUT_DIR)
  }
  fs.ensureDirSync(TEST_OUTPUT_DIR)

  // 生成项目
  console.log(chalk.cyan(`\n📦 生成测试项目...`))
  try {
    await generateProject(TEST_CONFIG)
    console.log(chalk.green(`  ✅ 项目生成成功`))
  }
  catch (error) {
    console.log(chalk.red(`  ❌ 项目生成失败:`), error)
    process.exit(1)
  }

  const projectDir = TEST_CONFIG.targetDir

  // 检查 package.json
  console.log(chalk.cyan(`\n🔍 检查 package.json 版本号...`))
  const packageJsonOk = checkPackageJsonVersions(projectDir)

  if (!packageJsonOk) {
    console.log(chalk.red.bold('\n❌ package.json 版本号检查失败\n'))
    process.exit(1)
  }

  console.log(chalk.green.bold('\n✅ 所有检查通过!\n'))
}

main().catch(console.error)
