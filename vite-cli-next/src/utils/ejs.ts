/**
 * EJS 模板渲染工具
 */

import fs from 'node:fs'
import path from 'node:path'
import ejs from 'ejs'

export interface EjsData {
  [key: string]: unknown
}

/**
 * 渲染 EJS 模板文件
 */
export function renderEjsFile(templatePath: string, data: EjsData): string {
  const template = fs.readFileSync(templatePath, 'utf-8')
  return ejs.render(template, data, {
    filename: templatePath,
  })
}

/**
 * 渲染 EJS 模板并写入目标文件
 */
export function renderEjsToFile(
  templatePath: string,
  targetPath: string,
  data: EjsData,
): void {
  const content = renderEjsFile(templatePath, data)
  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.writeFileSync(targetPath, content)
}
