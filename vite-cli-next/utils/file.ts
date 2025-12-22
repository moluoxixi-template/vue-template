/**
 * 文件操作工具
 */

import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import fs from 'fs-extra'

export function createDir(dirPath: string): void {
  fs.ensureDirSync(dirPath)
}

export function pathExists(path: string): boolean {
  return existsSync(path)
}

export function copyFile(src: string, dest: string): void {
  fs.ensureDirSync(dirname(dest))
  fs.copySync(src, dest, { overwrite: true })
}

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

export function writeFile(filePath: string, content: string): void {
  fs.ensureDirSync(dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf-8')
}

export function remove(path: string): void {
  fs.removeSync(path)
}
