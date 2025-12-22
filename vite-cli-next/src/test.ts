/**
 * 测试脚本
 * 生成测试产物并与样本进行比对
 */

import type { ProjectConfig } from './types'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import { renderProject } from './core/renderer'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = join(__dirname, '..')
const testOutputDir = join(rootDir, '..', 'vite-cli-next-test')
const sampleDir = join(rootDir, '..', 'vite-cli-test')

// 测试配置
const testConfigs: ProjectConfig[] = [
  {
    projectName: 'vue-element',
    description: 'Vue Element Plus Test',
    author: 'vite-cli',
    framework: 'vue',
    uiLibrary: 'element-plus',
    routeMode: 'file-system',
    i18n: true,
    qiankun: true,
    sentry: true,
    packageManager: 'pnpm',
    targetDir: join(testOutputDir, 'vue-element'),
  },
  {
    projectName: 'vue-antd',
    description: 'Vue Ant Design Test',
    author: 'vite-cli',
    framework: 'vue',
    uiLibrary: 'ant-design-vue',
    routeMode: 'file-system',
    i18n: true,
    qiankun: true,
    sentry: true,
    packageManager: 'pnpm',
    targetDir: join(testOutputDir, 'vue-antd'),
  },
  {
    projectName: 'react-antd',
    description: 'React Ant Design Test',
    author: 'vite-cli',
    framework: 'react',
    uiLibrary: 'ant-design',
    routeMode: 'file-system',
    i18n: true,
    qiankun: true,
    sentry: true,
    packageManager: 'pnpm',
    targetDir: join(testOutputDir, 'react-antd'),
  },
]

/**
 * 收集目录中的所有文件
 */
function collectFiles(dir: string, basePath: string = ''): string[] {
  if (!existsSync(dir)) {
    return []
  }

  const files: string[] = []
  const entries = readdirSync(dir)

  for (const entry of entries) {
    // 跳过 node_modules 和 .lock 文件
    if (entry === 'node_modules' || entry.endsWith('.lock') || entry === 'pnpm-lock.yaml') {
      continue
    }

    const fullPath = join(dir, entry)
    const relativePath = join(basePath, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...collectFiles(fullPath, relativePath))
    }
    else {
      files.push(relativePath)
    }
  }

  return files
}

/**
 * 规范化文件内容（统一换行符并去除尾部空白）
 */
function normalizeContent(content: string): string {
  return content
    .replace(/\r\n/g, '\n') // Windows -> Unix 换行符
    .replace(/\r/g, '\n') // 老式 Mac -> Unix 换行符
    .trim() // 去除首尾空白
}

/**
 * 比较两个文件的内容
 */
function compareFiles(file1: string, file2: string): { match: boolean, diff?: string } {
  if (!existsSync(file1)) {
    return { match: false, diff: `File missing: ${file1}` }
  }
  if (!existsSync(file2)) {
    return { match: false, diff: `File missing: ${file2}` }
  }

  const content1 = normalizeContent(readFileSync(file1, 'utf-8'))
  const content2 = normalizeContent(readFileSync(file2, 'utf-8'))

  if (content1 === content2) {
    return { match: true }
  }

  return {
    match: false,
    diff: `Content mismatch`,
  }
}

/**
 * 比较产物和样本
 */
function compareProject(outputDir: string, sampleDir: string): {
  totalFiles: number
  matchedFiles: number
  missingFiles: string[]
  extraFiles: string[]
  diffFiles: { file: string, reason: string }[]
} {
  const outputFiles = collectFiles(outputDir)
  const sampleFiles = collectFiles(sampleDir)

  const outputSet = new Set(outputFiles)
  const sampleSet = new Set(sampleFiles)

  const missingFiles: string[] = []
  const extraFiles: string[] = []
  const diffFiles: { file: string, reason: string }[] = []
  let matchedFiles = 0

  // 检查样本文件是否都存在于产物中
  for (const file of sampleFiles) {
    if (!outputSet.has(file)) {
      missingFiles.push(file)
    }
    else {
      const result = compareFiles(join(outputDir, file), join(sampleDir, file))
      if (result.match) {
        matchedFiles++
      }
      else {
        diffFiles.push({ file, reason: result.diff || 'Unknown' })
      }
    }
  }

  // 检查产物中是否有额外文件
  for (const file of outputFiles) {
    if (!sampleSet.has(file)) {
      extraFiles.push(file)
    }
  }

  return {
    totalFiles: sampleFiles.length,
    matchedFiles,
    missingFiles,
    extraFiles,
    diffFiles,
  }
}

/**
 * 主测试函数
 */
async function runTests(): Promise<void> {
  console.log(chalk.blue.bold('\n🧪 Running vite-cli-next tests...\n'))

  // 清理测试输出目录
  if (existsSync(testOutputDir)) {
    rmSync(testOutputDir, { recursive: true, force: true })
  }
  mkdirSync(testOutputDir, { recursive: true })

  const results: { name: string, result: ReturnType<typeof compareProject> }[] = []

  // 生成测试项目
  for (const config of testConfigs) {
    console.log(chalk.yellow(`\n📦 Generating: ${config.projectName}...`))

    try {
      mkdirSync(config.targetDir, { recursive: true })
      await renderProject(config)
      console.log(chalk.green(`  ✓ Generated successfully`))

      // 比对产物
      const samplePath = join(sampleDir, config.projectName)
      if (existsSync(samplePath)) {
        const result = compareProject(config.targetDir, samplePath)
        results.push({ name: config.projectName, result })
      }
      else {
        console.log(chalk.yellow(`  ⚠ Sample not found: ${samplePath}`))
      }
    }
    catch (error) {
      console.log(chalk.red(`  ✗ Generation failed: ${error}`))
    }
  }

  // 输出比对报告
  console.log(chalk.blue.bold('\n📊 Comparison Report\n'))
  console.log('='.repeat(60))

  for (const { name, result } of results) {
    console.log(chalk.cyan(`\n📁 ${name}`))
    console.log(`  Total files: ${result.totalFiles}`)
    console.log(`  Matched: ${chalk.green(result.matchedFiles.toString())}`)
    console.log(`  Missing: ${chalk.red(result.missingFiles.length.toString())}`)
    console.log(`  Extra: ${chalk.yellow(result.extraFiles.length.toString())}`)
    console.log(`  Different: ${chalk.red(result.diffFiles.length.toString())}`)

    if (result.missingFiles.length > 0) {
      console.log(chalk.red('\n  Missing files:'))
      result.missingFiles.slice(0, 10).forEach(f => console.log(`    - ${f}`))
      if (result.missingFiles.length > 10) {
        console.log(`    ... and ${result.missingFiles.length - 10} more`)
      }
    }

    if (result.diffFiles.length > 0) {
      console.log(chalk.yellow('\n  Different files:'))
      result.diffFiles.slice(0, 10).forEach(f => console.log(`    - ${f.file}: ${f.reason}`))
      if (result.diffFiles.length > 10) {
        console.log(`    ... and ${result.diffFiles.length - 10} more`)
      }
    }

    if (result.extraFiles.length > 0) {
      console.log(chalk.blue('\n  Extra files in output:'))
      result.extraFiles.slice(0, 5).forEach(f => console.log(`    + ${f}`))
      if (result.extraFiles.length > 5) {
        console.log(`    ... and ${result.extraFiles.length - 5} more`)
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`)

  // 计算总体结果
  const totalMatch = results.every(r =>
    r.result.missingFiles.length === 0
    && r.result.diffFiles.length === 0,
  )

  if (totalMatch) {
    console.log(chalk.green.bold('\n✅ All tests passed!\n'))
  }
  else {
    console.log(chalk.yellow.bold('\n⚠ Some differences found. Please review the report above.\n'))
  }
}

// 运行测试
runTests().catch(console.error)
