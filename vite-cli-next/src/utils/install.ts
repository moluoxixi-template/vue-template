/**
 * 依赖安装工具
 */

import type { PackageManager } from '../types'
import { execSync } from 'node:child_process'

/**
 * 安装项目依赖
 * @param packageManager 包管理器
 * @param targetDir 目标目录
 */
export function installDependencies(
  packageManager: PackageManager,
  targetDir: string,
): void {
  const command = getInstallCommand(packageManager)

  execSync(command, {
    cwd: targetDir,
    stdio: 'inherit',
  })
}

/**
 * 获取安装命令
 * @param packageManager 包管理器
 * @returns 安装命令
 */
function getInstallCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm install'
    case 'yarn':
      return 'yarn'
    case 'npm':
      return 'npm install'
    default:
      return 'pnpm install'
  }
}

/**
 * 检测可用的包管理器
 * @returns 包管理器
 */
export function detectPackageManager(): PackageManager {
  try {
    execSync('pnpm --version', { stdio: 'ignore' })
    return 'pnpm'
  }
  catch {
    try {
      execSync('yarn --version', { stdio: 'ignore' })
      return 'yarn'
    }
    catch {
      return 'npm'
    }
  }
}
