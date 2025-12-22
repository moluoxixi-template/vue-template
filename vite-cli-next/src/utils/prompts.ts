/**
 * 交互式提示工具
 */

import type { Framework, PackageManager, ProjectConfig, RouteMode, UILibrary } from '../types'
import { join } from 'node:path'
import process from 'node:process'
import inquirer from 'inquirer'
import { detectPackageManager } from './install'

/**
 * 收集项目配置
 * @param projectName 项目名称（可选）
 * @returns 项目配置
 */
export async function collectProjectConfig(projectName?: string): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectName || 'my-project',
      when: !projectName,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description:',
      default: 'A Vite project',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author:',
      default: 'vite-cli',
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Select framework:',
      choices: [
        { name: 'Vue 3', value: 'vue' },
        { name: 'React', value: 'react' },
      ],
    },
    {
      type: 'list',
      name: 'uiLibrary',
      message: 'Select UI library:',
      choices: (answers) => {
        if (answers.framework === 'vue') {
          return [
            { name: 'Element Plus', value: 'element-plus' },
            { name: 'Ant Design Vue', value: 'ant-design-vue' },
          ]
        }
        return [{ name: 'Ant Design', value: 'ant-design' }]
      },
    },
    {
      type: 'list',
      name: 'routeMode',
      message: 'Select route mode:',
      choices: [
        { name: 'File-based routing (vite-plugin-pages)', value: 'file-system' },
        { name: 'Manual routing', value: 'manual' },
      ],
    },
    {
      type: 'confirm',
      name: 'i18n',
      message: 'Enable internationalization (i18n)?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'qiankun',
      message: 'Enable micro-frontend (qiankun)?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'sentry',
      message: 'Enable error monitoring (Sentry)?',
      default: true,
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Select package manager:',
      choices: [
        { name: 'pnpm', value: 'pnpm' },
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
      ],
      default: detectPackageManager(),
    },
  ])

  const finalProjectName = projectName || answers.projectName

  return {
    projectName: finalProjectName,
    description: answers.description,
    author: answers.author,
    framework: answers.framework as Framework,
    uiLibrary: answers.uiLibrary as UILibrary,
    routeMode: answers.routeMode as RouteMode,
    i18n: answers.i18n,
    qiankun: answers.qiankun,
    sentry: answers.sentry,
    packageManager: answers.packageManager as PackageManager,
    targetDir: join(process.cwd(), finalProjectName),
  }
}
