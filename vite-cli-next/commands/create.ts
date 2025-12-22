/**
 * Create 命令
 * 创建新项目的核心逻辑
 */

import type { ProjectConfig } from '../types/index.ts'
import process from 'node:process'
import chalk from 'chalk'

import ora from 'ora'
import { renderProject } from '../core/renderer.ts'
import { pathExists } from '../utils/file.js'
import { installDependencies } from '../utils/install.ts'
import { collectProjectConfig } from '../utils/prompts.ts'

/**
 * 创建项目
 * @param projectName 项目名称（可选）
 */
export async function createProject(projectName?: string): Promise<void> {
  try {
    console.log(chalk.blue.bold('\n🚀 Welcome to Vite Template CLI (Next)!\n'))

    const config: ProjectConfig = await collectProjectConfig(projectName)

    if (pathExists(config.targetDir)) {
      console.log(
        chalk.red(`\n❌ Directory ${config.targetDir} already exists!\n`),
      )
      process.exit(1)
    }

    console.log(chalk.green('\n📋 Project Configuration:'))
    console.log(chalk.gray(`  Framework: ${chalk.white(config.framework)}`))
    console.log(chalk.gray(`  UI Library: ${chalk.white(config.uiLibrary)}`))
    console.log(chalk.gray(`  Route Mode: ${chalk.white(config.routeMode)}`))
    console.log(chalk.gray(`  i18n: ${chalk.white(config.i18n ? 'Yes' : 'No')}`))
    console.log(chalk.gray(`  Qiankun: ${chalk.white(config.qiankun ? 'Yes' : 'No')}`))
    console.log(chalk.gray(`  Sentry: ${chalk.white(config.sentry ? 'Yes' : 'No')}`))
    console.log(chalk.gray(`  Package Manager: ${chalk.white(config.packageManager)}`))
    console.log('')

    const spinner = ora('Creating project...').start()
    try {
      await renderProject(config)
      spinner.succeed('Project created successfully!')
    }
    catch (error) {
      spinner.fail('Failed to create project')
      throw error
    }

    const installSpinner = ora('Installing dependencies...').start()
    try {
      installDependencies(config.packageManager, config.targetDir)
      installSpinner.succeed('Dependencies installed successfully!')
    }
    catch {
      installSpinner.fail('Failed to install dependencies')
      console.log(
        chalk.yellow('\n⚠️  Project created, but dependencies installation failed.'),
      )
      console.log(
        chalk.yellow(
          `   Please run "${config.packageManager} install" manually in ${config.targetDir}`,
        ),
      )
    }

    console.log(chalk.green.bold('\n✅ Project created successfully!\n'))
    console.log(chalk.blue('Next steps:'))
    console.log(chalk.gray(`  cd ${config.projectName}`))
    console.log(chalk.gray(`  ${config.packageManager} dev\n`))
  }
  catch (error) {
    console.error(chalk.red('\n❌ Error:'), error)
    process.exit(1)
  }
}
