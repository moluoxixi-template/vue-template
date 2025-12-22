#!/usr/bin/env node

/**
 * Vite Template CLI (Next)
 * 原子化分层叠加架构的脚手架工具
 */

import { Command } from 'commander'
import { createProject } from './commands/create'
import { getVersion } from './utils/version'

/**
 * 创建并运行 CLI 程序
 */
function runCli(): void {
  const program = new Command()

  program
    .name('vite-cli-next')
    .description('Vite template CLI with atomic layered architecture')
    .version(getVersion())

  program
    .command('create')
    .alias('c')
    .description('Create a new project')
    .argument('[project-name]', 'Project name')
    .action(async (projectName?: string) => {
      await createProject(projectName)
    })

  program.parse()
}

runCli()
