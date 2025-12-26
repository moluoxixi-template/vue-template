/**
 * 模板渲染工具
 * 参考 create-vue 实现物理路径合并和对象合并
 * https://github.com/vuejs/create-vue
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 渲染模板目录到目标目录
 * 物理路径合并：同路径文件直接覆盖
 * package.json：深度合并
 */
export function renderTemplate(src: string, dest: string, callbacks?: Array<(datafile: string, dest: string) => void>): void {
  const stats = fs.statSync(src)

  if (stats.isDirectory()) {
    // 跳过 node_modules
    if (path.basename(src) === 'node_modules') {
      return
    }

    // 创建目标目录
    fs.mkdirSync(dest, { recursive: true })

    // 递归处理子文件和目录
    for (const file of fs.readdirSync(src)) {
      renderTemplate(path.resolve(src, file), path.resolve(dest, file), callbacks)
    }
    return
  }

  const filename = path.basename(src)

  // package.json 需要深度合并
  if (filename === 'package.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))
    const merged = deepMerge(existing, newPackage)
    fs.writeFileSync(dest, `${JSON.stringify(sortDependencies(merged), null, 2)}\n`)
    return
  }

  // pnpm-workspace.yaml 需要合并 catalogs
  if (filename === 'pnpm-workspace.yaml' && fs.existsSync(dest)) {
    const existingContent = fs.readFileSync(dest, 'utf8')
    const newContent = fs.readFileSync(src, 'utf8')
    const merged = mergePnpmWorkspace(existingContent, newContent)
    fs.writeFileSync(dest, merged)
    return
  }

  // extensions.json 需要合并
  if (filename === 'extensions.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newExt = JSON.parse(fs.readFileSync(src, 'utf8'))
    const merged = deepMerge(existing, newExt)
    fs.writeFileSync(dest, `${JSON.stringify(merged, null, 2)}\n`)
    return
  }

  // _开头的文件转换为.开头（gitignore, npmrc 等）
  if (filename.startsWith('_')) {
    const newFilename = `.${filename.slice(1)}`
    dest = path.resolve(path.dirname(dest), newFilename)
  }

  // 直接复制文件（覆盖）
  fs.copyFileSync(src, dest)

  // 执行回调
  if (callbacks) {
    for (const cb of callbacks) {
      cb(src, dest)
    }
  }
}

/**
 * 合并 pnpm-workspace.yaml
 * 简单的文本合并，合并 catalogs 中的依赖
 */
function mergePnpmWorkspace(existing: string, newContent: string): string {
  // 简单实现：追加新内容中 catalogs 下的依赖
  // 实际应该用 YAML 解析器，这里简化处理
  const lines = existing.split('\n')
  const newLines = newContent.split('\n')

  // 找到 catalogs 部分并合并
  let inCatalogs = false
  let currentSection = ''
  const catalogSections: Record<string, string[]> = {
    build: [],
    dev: [],
    type: [],
  }

  // 解析现有内容
  for (const line of lines) {
    if (line.trim() === 'catalogs:') {
      inCatalogs = true
      continue
    }
    if (inCatalogs) {
      if (line.match(/^\s{2}\w+:/)) {
        currentSection = line.trim().replace(':', '')
      }
      else if (line.match(/^\s{4}/) && currentSection) {
        catalogSections[currentSection]?.push(line)
      }
    }
  }

  // 解析新内容并合并
  inCatalogs = false
  currentSection = ''
  for (const line of newLines) {
    if (line.trim() === 'catalogs:') {
      inCatalogs = true
      continue
    }
    if (inCatalogs) {
      if (line.match(/^\s{2}\w+:/)) {
        currentSection = line.trim().replace(':', '')
      }
      else if (line.match(/^\s{4}/) && currentSection) {
        const depLine = line.trim()
        const depName = depLine.split(':')[0]
        // 检查是否已存在
        const exists = catalogSections[currentSection]?.some(l => l.includes(depName))
        if (!exists && catalogSections[currentSection]) {
          catalogSections[currentSection].push(line)
        }
      }
    }
  }

  // 重建文件内容
  let result = '# pnpm workspace 配置\n# 用于管理项目依赖版本\n\ngitChecks: false\nregistry: https://registry.npmjs.org/\n\ncatalogs:\n'

  for (const section of ['build', 'dev', 'type']) {
    if (catalogSections[section] && catalogSections[section].length > 0) {
      result += `  ${section}:\n`
      // 排序并去重
      const sorted = [...new Set(catalogSections[section])].sort()
      for (const line of sorted) {
        result += `${line}\n`
      }
    }
  }

  return result
}

/**
 * 获取模板根目录
 */
export function getTemplateDir(): string {
  return path.resolve(__dirname, '../templates')
}
