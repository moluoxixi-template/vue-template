/**
 * 依赖安装工具
 */

import type { PackageManager } from '../types/index.ts'
import { execSync } from 'node:child_process'

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
