/**
 * 中央配置处理器类型定义
 */

/**
 * Import 声明（结构化，而非字符串）
 */
export interface ImportDeclaration {
  /** 导入来源 */
  from: string
  /** 默认导入 */
  default?: string
  /** 命名导入列表 */
  named?: string[]
  /** 类型导入 */
  typeOnly?: boolean
  /** 优先级（数字越小越先导入） */
  priority?: number
}

/**
 * Setup Hook（初始化代码块）
 */
export interface SetupHook {
  /** Hook 名称（用于排序和冲突检测） */
  name: string
  /** 代码片段 */
  code: string
  /** 执行顺序（数字越小越先执行） */
  order?: number
  /** 依赖的 Hook（确保依赖先执行） */
  deps?: string[]
  /** 条件表达式（可选，在运行时评估） */
  condition?: string
}

/**
 * Vite Plugin 声明
 */
export interface VitePluginDeclaration {
  /** 插件名称 */
  name: string
  /** Import 声明 */
  import: ImportDeclaration
  /** 实例化代码 */
  instantiate: string
  /** 执行顺序 */
  order?: number
}

/**
 * Vite Config 片段
 */
export interface ViteConfigFragment {
  /** 配置路径（如 'css.preprocessorOptions.scss'） */
  path: string
  /** 配置值（将被深度合并） */
  value: unknown
  /** 合并策略：merge（深度合并）| replace（替换） */
  strategy?: 'merge' | 'replace'
}

/**
 * ESLint Config 片段
 */
export interface ESLintConfigFragment {
  /** 配置对象 */
  config: Record<string, unknown>
  /** 合并顺序 */
  order?: number
}

/**
 * Feature 声明（声明式元数据）
 */
export interface FeatureDeclaration {
  /** Feature 名称 */
  name: string
  /** 是否启用 */
  enabled: (config: Record<string, unknown>) => boolean
  /** main.ts/tsx 相关声明 */
  main?: {
    /** Import 声明列表 */
    imports?: ImportDeclaration[]
    /** Setup Hook 列表 */
    hooks?: SetupHook[]
    /** 样式导入列表 */
    styles?: ImportDeclaration[]
  }
  /** vite.config.ts 相关声明 */
  vite?: {
    /** Plugin 声明列表 */
    plugins?: VitePluginDeclaration[]
    /** Config 片段列表 */
    configs?: ViteConfigFragment[]
  }
  /** eslint.config.ts 相关声明 */
  eslint?: {
    /** Config 片段列表 */
    configs?: ESLintConfigFragment[]
  }
}

/**
 * 处理后的模板数据
 */
export interface ProcessedTemplateData {
  config: Record<string, unknown>
  /** main.ts/tsx 最终数据 */
  main: {
    /** 格式化后的类型导入语句 */
    typeImports: string[]
    /** 格式化后的普通导入语句 */
    imports: string[]
    /** 格式化后的样式导入语句 */
    styles: string[]
    /** 排序后的初始化代码 */
    inits: string[]
    /** 是否启用 qiankun */
    qiankun: boolean
    /** React 渲染代码（仅 React 使用） */
    renderCode?: string
  }
  /** vite.config.ts 最终数据 */
  vite: {
    /** 格式化后的导入语句 */
    imports: string[]
    /** 排序后的插件实例化代码 */
    plugins: string[]
    /** 合并后的配置对象 */
    config: Record<string, unknown>
    /** 格式化后的 CSS 配置字符串（用于模板渲染） */
    formattedCssConfig?: string
  }
  /** eslint.config.ts 最终数据 */
  eslint: {
    /** 合并后的配置块 */
    configBlocks: Array<Record<string, unknown>>
    /** 生成的文件内容（无需 EJS 模板） */
    fileContent: string
  }
}
