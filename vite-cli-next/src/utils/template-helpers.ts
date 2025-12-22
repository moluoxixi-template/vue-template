/**
 * 模板辅助函数
 * 提供模板渲染中常用的工具函数
 */

/**
 * 格式化插件数组，添加逗号和换行
 */
export function formatPluginArray(
  plugins: string[],
  indent: number = 10,
): string {
  if (plugins.length === 0) {
    return ''
  }

  const indentStr = ' '.repeat(indent)
  return plugins
    .map((plugin, index) => {
      const suffix = index < plugins.length - 1 ? ',' : ''
      return `${indentStr}${plugin}${suffix}`
    })
    .join('\n')
}

/**
 * 格式化初始化代码数组，添加缩进
 */
export function formatInitCode(
  inits: string[],
  indent: number = 2,
): string {
  if (inits.length === 0) {
    return ''
  }

  const indentStr = ' '.repeat(indent)
  return inits.map(init => `${indentStr}${init}`).join('\n')
}

/**
 * 格式化导入语句数组
 */
export function formatImports(imports: string[]): string {
  return imports.join('\n')
}

/**
 * 格式化 JSON 配置为字符串，用于 EJS 模板
 */
export function formatJsonConfig(
  config: Record<string, unknown>,
  indent: number = 12,
): string {
  const jsonStr = JSON.stringify(config, null, 2)
  const lines = jsonStr.split('\n')
  const indentStr = ' '.repeat(indent)

  return lines
    .map((line, index) => {
      if (index === 0) {
        return line
      }
      return `${indentStr}${line}`
    })
    .join('\n')
    .replace(/"/g, "'")
}

/**
 * 检查是否有内容需要渲染
 */
export function hasContent(items: unknown[]): boolean {
  return items.length > 0
}

/**
 * 生成条件表达式
 */
export function createCondition(
  key: string,
  value: unknown,
): string {
  return `${key} === ${JSON.stringify(value)}`
}

