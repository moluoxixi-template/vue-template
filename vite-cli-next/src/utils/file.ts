/**
 * 文件操作工具
 */

import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import fs from 'fs-extra'

/**
 * 创建目录
 * @param dirPath 目录路径
 */
export function createDir(dirPath: string): void {
  fs.ensureDirSync(dirPath)
}

/**
 * 检查文件或目录是否存在
 * @param path 路径
 * @returns 是否存在
 */
export function pathExists(path: string): boolean {
  return existsSync(path)
}

/**
 * 复制文件或目录
 * @param src 源路径
 * @param dest 目标路径
 */
export function copyFile(src: string, dest: string): void {
  fs.ensureDirSync(dirname(dest))
  fs.copySync(src, dest, { overwrite: true })
}

/**
 * 读取文件内容
 * @param filePath 文件路径
 * @returns 文件内容
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8')
}

/**
 * 写入文件内容
 * @param filePath 文件路径
 * @param content 文件内容
 */
export function writeFile(filePath: string, content: string): void {
  fs.ensureDirSync(dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf-8')
}

/**
 * 删除文件或目录
 * @param path 路径
 */
export function remove(path: string): void {
  fs.removeSync(path)
}
