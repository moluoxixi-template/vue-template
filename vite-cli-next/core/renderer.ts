/**
 * 核心渲染引擎
 * 负责分层合并和文件渲染
 */

import type { LayerConfig, ProjectConfig } from '../types/index.ts'
import type { ProcessedTemplateData } from './orchestrator/types.ts'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import ejs from 'ejs'
import fs from 'fs-extra'
import { resolveLayers } from './layerResolver.ts'
import { mergePackageJson, mergeTsConfig } from './merger.ts'
import { createTemplateData } from './templateData.ts'

export async function renderProject(config: ProjectConfig): Promise<void> {
  const layers = resolveLayers(config)
  const ejsData = createTemplateData(config)

  const fileMap = new Map<string, { sourcePath: string, layer: LayerConfig }[]>()

  for (const layer of layers) {
    if (!existsSync(layer.path)) {
      console.warn(`Layer not found: ${layer.path}`)
      continue
    }
    collectFiles(layer.path, '', layer, fileMap)
  }

  for (const [relativePath, sources] of fileMap) {
    await processFile(relativePath, sources, config, ejsData)
  }

  const eslintConfigPath = join(config.targetDir, 'eslint.config.ts')
  fs.ensureDirSync(dirname(eslintConfigPath))
  writeFileSync(eslintConfigPath, ejsData.eslint.fileContent, 'utf-8')
}

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

async function processFile(
  relativePath: string,
  sources: { sourcePath: string, layer: LayerConfig }[],
  config: ProjectConfig,
  ejsData: ProcessedTemplateData,
): Promise<void> {
  const targetPath = join(config.targetDir, relativePath)
  const fileName = basename(relativePath)

  fs.ensureDirSync(dirname(targetPath))

  if (fileName === 'package.json') {
    await processPackageJson(sources, targetPath, config)
  }
  else if (fileName.startsWith('tsconfig') && fileName.endsWith('.json')) {
    await processTsConfig(sources, targetPath)
  }
  else {
    const lastSource = sources[sources.length - 1]
    await processRegularFile(lastSource.sourcePath, targetPath, ejsData)
  }
}

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

  result.name = config.projectName
  if (config.author) {
    result.author = config.author
  }

  writeFileSync(targetPath, `${JSON.stringify(result, null, 2)}\n`, 'utf-8')
}

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

async function processRegularFile(
  sourcePath: string,
  targetPath: string,
  ejsData: ProcessedTemplateData,
): Promise<void> {
  const content = readFileSync(sourcePath, 'utf-8')

  if (sourcePath.endsWith('.ejs')) {
    const rendered = ejs.render(content, {
      ...ejsData,
      main: ejsData.main,
      vite: ejsData.vite,
      eslint: ejsData.eslint,
      config: ejsData.config,
    }, {
      filename: sourcePath,
    })
    writeFileSync(targetPath, rendered, 'utf-8')
  }
  else {
    writeFileSync(targetPath, content, 'utf-8')
  }
}
