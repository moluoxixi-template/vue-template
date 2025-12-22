/**
 * 中央配置处理器类型定义
 */

export interface ImportDeclaration {
  from: string
  default?: string
  named?: string[]
  typeOnly?: boolean
  priority?: number
}

export interface SetupHook {
  name: string
  code: string
  order?: number
  deps?: string[]
  condition?: string
}

export interface VitePluginDeclaration {
  name: string
  import: ImportDeclaration
  instantiate: string
  order?: number
}

export interface ViteConfigFragment {
  path: string
  value: unknown
  strategy?: 'merge' | 'replace'
}

export interface ESLintConfigFragment {
  config: Record<string, unknown>
  order?: number
}

export interface FeatureDeclaration {
  name: string
  enabled: (config: Record<string, unknown>) => boolean
  main?: {
    imports?: ImportDeclaration[]
    hooks?: SetupHook[]
    styles?: ImportDeclaration[]
  }
  vite?: {
    plugins?: VitePluginDeclaration[]
    configs?: ViteConfigFragment[]
  }
  eslint?: {
    configs?: ESLintConfigFragment[]
  }
}

export interface ProcessedTemplateData {
  config: Record<string, unknown>
  main: {
    typeImports: string[]
    imports: string[]
    styles: string[]
    inits: string[]
    qiankun: boolean
    renderCode?: string
  }
  vite: {
    imports: string[]
    plugins: string[]
    config: Record<string, unknown>
    formattedCssConfig?: string
  }
  eslint: {
    configBlocks: Array<Record<string, unknown>>
    fileContent: string
  }
}
