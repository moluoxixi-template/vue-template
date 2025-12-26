/**
 * 模板渲染工具
 * EJS 模板渲染相关函数
 */

import type { TemplateContextType } from '../types'
import ejs from 'ejs'
import path from 'node:path'
import { getTemplatesDir, readFile, writeFile } from './file'

/**
 * 渲染 EJS 模板
 * @param templatePath 模板相对路径
 * @param context 渲染上下文
 */
export function renderTemplate(templatePath: string, context: TemplateContextType): string {
  const fullPath = path.join(getTemplatesDir(), templatePath)
  const template = readFile(fullPath)
  return ejs.render(template, context, { filename: fullPath })
}

/**
 * 复制并渲染模板到目标位置
 * @param templatePath 模板相对路径
 * @param targetPath 目标路径
 * @param context 渲染上下文
 */
export function copyAndRenderTemplate(
  templatePath: string,
  targetPath: string,
  context: TemplateContextType,
): void {
  const content = renderTemplate(templatePath, context)
  writeFile(targetPath, content)
}

/**
 * 复制静态文件（不渲染）
 * @param templatePath 模板相对路径
 * @param targetPath 目标路径
 */
export function copyStaticFile(templatePath: string, targetPath: string): void {
  const fullPath = path.join(getTemplatesDir(), templatePath)
  const content = readFile(fullPath)
  writeFile(targetPath, content)
}

/**
 * 判断是否为 EJS 模板
 * @param filePath 文件路径
 */
export function isEjsTemplate(filePath: string): boolean {
  return filePath.endsWith('.ejs')
}

/**
 * 获取渲染后的文件名
 * @param filePath 文件路径
 */
export function getRenderedFileName(filePath: string): string {
  if (isEjsTemplate(filePath)) {
    return filePath.slice(0, -4) // 移除 .ejs 后缀
  }
  return filePath
}
