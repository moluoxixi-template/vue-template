/**
 * 核心渲染引擎
 * 负责分层合并和文件渲染
 */

import type { EjsRenderData, LayerConfig, ProjectConfig } from '../types'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import ejs from 'ejs'
import fs from 'fs-extra'
import { resolveLayers } from './layer-resolver'
import { mergePackageJson, mergeTsConfig } from './merger'

/**
 * 渲染项目
 * @param config 项目配置
 */
export async function renderProject(config: ProjectConfig): Promise<void> {
  const layers = resolveLayers(config)
  const ejsData = createEjsRenderData(config)

  // 收集所有层的文件
  const fileMap = new Map<string, { sourcePath: string, layer: LayerConfig }[]>()

  for (const layer of layers) {
    if (!existsSync(layer.path)) {
      console.warn(`Layer not found: ${layer.path}`)
      continue
    }
    collectFiles(layer.path, '', layer, fileMap)
  }

  // 处理每个文件
  for (const [relativePath, sources] of fileMap) {
    await processFile(relativePath, sources, config, ejsData)
  }
}

/**
 * 递归收集层中的所有文件
 */
function collectFiles(
  basePath: string,
  currentPath: string,
  layer: LayerConfig,
  fileMap: Map<string, { sourcePath: string, layer: LayerConfig }[]>,
): void {
  const fullPath = join(basePath, currentPath)
  const entries = readdirSync(fullPath)

  for (const entry of entries) {
    const entryPath = join(currentPath, entry)
    const fullEntryPath = join(basePath, entryPath)
    const stat = statSync(fullEntryPath)

    if (stat.isDirectory()) {
      collectFiles(basePath, entryPath, layer, fileMap)
    }
    else {
      // 移除 .ejs 扩展名用于最终路径
      const finalPath = entry.endsWith('.ejs')
        ? join(dirname(entryPath), basename(entry, '.ejs'))
        : entryPath

      if (!fileMap.has(finalPath)) {
        fileMap.set(finalPath, [])
      }
      fileMap.get(finalPath)!.push({ sourcePath: fullEntryPath, layer })
    }
  }
}

/**
 * 处理单个文件
 */
async function processFile(
  relativePath: string,
  sources: { sourcePath: string, layer: LayerConfig }[],
  config: ProjectConfig,
  ejsData: EjsRenderData,
): Promise<void> {
  const targetPath = join(config.targetDir, relativePath)
  const fileName = basename(relativePath)

  // 确保目标目录存在
  fs.ensureDirSync(dirname(targetPath))

  // 根据文件类型选择处理策略
  if (fileName === 'package.json') {
    await processPackageJson(sources, targetPath, config)
  }
  else if (fileName.startsWith('tsconfig') && fileName.endsWith('.json')) {
    await processTsConfig(sources, targetPath)
  }
  else {
    // 其他文件：后层覆盖前层
    const lastSource = sources[sources.length - 1]
    await processRegularFile(lastSource.sourcePath, targetPath, ejsData)
  }
}

/**
 * 处理 package.json 文件（深度合并）
 */
async function processPackageJson(
  sources: { sourcePath: string, layer: LayerConfig }[],
  targetPath: string,
  config: ProjectConfig,
): Promise<void> {
  let result: Record<string, unknown> = {}

  for (const source of sources) {
    const content = readFileSync(source.sourcePath, 'utf-8')
    const json = JSON.parse(content)
    result = mergePackageJson(result, json)
  }

  // 设置项目特定字段
  result.name = config.projectName
  if (config.author) {
    result.author = config.author
  }

  writeFileSync(targetPath, `${JSON.stringify(result, null, 2)}\n`, 'utf-8')
}

/**
 * 处理 tsconfig 文件（深度合并）
 */
async function processTsConfig(
  sources: { sourcePath: string, layer: LayerConfig }[],
  targetPath: string,
): Promise<void> {
  let result: Record<string, unknown> = {}

  for (const source of sources) {
    const content = readFileSync(source.sourcePath, 'utf-8')
    const json = JSON.parse(content)
    result = mergeTsConfig(result, json)
  }

  writeFileSync(targetPath, `${JSON.stringify(result, null, 2)}\n`, 'utf-8')
}

/**
 * 处理普通文件（覆盖或 EJS 渲染）
 */
async function processRegularFile(
  sourcePath: string,
  targetPath: string,
  ejsData: EjsRenderData,
): Promise<void> {
  const content = readFileSync(sourcePath, 'utf-8')

  // 检查源文件是否是 EJS 模板
  if (sourcePath.endsWith('.ejs')) {
    // EJS 渲染
    const rendered = ejs.render(content, ejsData, {
      filename: sourcePath,
    })
    writeFileSync(targetPath, rendered, 'utf-8')
  }
  else {
    // 直接复制
    writeFileSync(targetPath, content, 'utf-8')
  }
}

/**
 * 创建 EJS 渲染数据
 */
function createEjsRenderData(config: ProjectConfig): EjsRenderData {
  return {
    config,
    isVue: config.framework === 'vue',
    isReact: config.framework === 'react',
    isFileSystemRoute: config.routeMode === 'file-system',
    isManualRoute: config.routeMode === 'manual',
    isElementPlus: config.uiLibrary === 'element-plus',
    isAntDesignVue: config.uiLibrary === 'ant-design-vue',
    isAntDesign: config.uiLibrary === 'ant-design',
  }
}
