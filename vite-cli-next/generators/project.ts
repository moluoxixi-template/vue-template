/**
 * 项目生成器
 * 根据配置生成完整的项目结构
 */

import type { ProjectConfig } from '../types'
import { renderProject } from '../core/renderer'
import { createDir } from '../utils/file'

/**
 * 生成项目
 * @param config 项目配置
 */
export async function generateProject(config: ProjectConfig): Promise<void> {
  createDir(config.targetDir)
  await renderProject(config)
}
