/**
 * CLI 类型定义
 * 定义项目配置、特性、模板层级等核心类型
 */

/**
 * 框架类型
 */
export type FrameworkType = 'vue' | 'react'

/**
 * UI 库类型
 */
export type UILibraryType = 'element-plus' | 'ant-design-vue' | 'ant-design'

/**
 * 路由模式类型
 */
export type RouteModeType = 'file-system' | 'manual'

/**
 * 包管理器类型
 */
export type PackageManagerType = 'pnpm' | 'npm' | 'yarn'

/**
 * 模板层级类型
 */
export type TemplateLayerType = 'L0' | 'L1' | 'L2'

/**
 * 特性标识类型
 */
export type FeatureFlagType
  = | 'router'
    | 'pinia'
    | 'i18n'
    | 'sentry'
    | 'qiankun'
    | 'pageRoutes'
    | 'uiLibrary'

/**
 * 项目配置接口
 */
export interface ProjectConfigType {
  /** 项目名称 */
  projectName: string
  /** 项目描述 */
  description: string
  /** 作者 */
  author: string
  /** 框架类型 */
  framework: FrameworkType
  /** UI 库 */
  uiLibrary: UILibraryType
  /** 路由模式 */
  routeMode: RouteModeType
  /** 是否启用国际化 */
  i18n: boolean
  /** 是否启用微前端支持 */
  qiankun: boolean
  /** 是否启用错误监控 */
  sentry: boolean
  /** 包管理器 */
  packageManager: PackageManagerType
  /** 目标目录 */
  targetDir: string
}

/**
 * Vite 配置数据接口
 * L2 features 层的 vite.config.data.ts 导出格式
 */
export interface ViteConfigDataType {
  /** 需要导入的模块 [[标识符, 模块路径]] */
  imports: Array<[string, string]>
  /** 插件配置字符串 */
  plugins: string[]
  /** 部分 Vite 配置 */
  config: Record<string, unknown>
}

/**
 * Vite 配置数据工厂函数类型
 */
export type ViteConfigDataFactoryType = (
  config: ProjectConfigType,
) => ViteConfigDataType

/**
 * 特性元数据接口
 */
export interface FeatureMetadataType {
  /** 特性标识 */
  id: FeatureFlagType
  /** 特性名称 */
  name: string
  /** 特性描述 */
  description: string
  /** 依赖的其他特性 */
  dependencies?: FeatureFlagType[]
  /** 是否影响 pnpm-workspace.yaml */
  affectsWorkspace: boolean
  /** 对 main.ts 的影响 */
  mainTsHooks?: MainTsHooksType
  /** package.json 依赖 */
  packageDeps?: PackageDepsType
  /** vite.config.ts 配置 */
  viteConfigData?: ViteConfigDataFactoryType
}

/**
 * main.ts hooks 类型
 */
export interface MainTsHooksType {
  /** 导入语句 */
  imports?: string[]
  /** app.use() 调用 */
  appUse?: string[]
  /** 初始化逻辑（在 createApp 后） */
  init?: string[]
  /** mount 前逻辑 */
  beforeMount?: string[]
}

/**
 * package.json 依赖类型
 */
export interface PackageDepsType {
  /** 运行时依赖 */
  dependencies?: Record<string, string>
  /** 开发依赖 */
  devDependencies?: Record<string, string>
}

/**
 * 深度合并的 package.json 结构
 */
export interface PackageJsonType {
  'name': string
  'version': string
  'type': string
  'private': boolean
  'engines'?: Record<string, string>
  'packageManager'?: string
  'scripts'?: Record<string, string>
  'postcss'?: Record<string, unknown>
  'lint-staged'?: Record<string, string[]>
  'config'?: Record<string, unknown>
  'dependencies': Record<string, string>
  'devDependencies': Record<string, string>
  'author'?: string
  'license'?: string
  'pnpm'?: Record<string, unknown>
}

/**
 * pnpm-workspace.yaml 结构
 */
export interface PnpmWorkspaceType {
  gitChecks: boolean
  registry: string
  catalogs: {
    build: Record<string, string>
    dev: Record<string, string>
    type: Record<string, string>
  }
}

/**
 * 模板渲染上下文
 */
export interface TemplateContextType extends ProjectConfigType {
  /** Element Plus UI 库标识 */
  isElementPlus: boolean
  /** Ant Design Vue UI 库标识 */
  isAntDesignVue: boolean
  /** Ant Design UI 库标识 */
  isAntDesign: boolean
  /** 文件系统路由标识 */
  isPageRoutes: boolean
  /** 启用的特性列表 */
  enabledFeatures: FeatureFlagType[]
}

/**
 * 文件操作类型
 */
export type FileOperationType = 'copy' | 'render' | 'merge' | 'skip'

/**
 * 文件映射配置
 */
export interface FileMappingType {
  /** 源文件路径（相对于模板目录） */
  source: string
  /** 目标文件路径（相对于项目目录） */
  target: string
  /** 操作类型 */
  operation: FileOperationType
  /** 条件函数（返回 false 则跳过） */
  condition?: (config: ProjectConfigType) => boolean
}

/**
 * 层级配置
 */
export interface LayerConfigType {
  /** 层级标识 */
  layer: TemplateLayerType
  /** 模板目录 */
  templateDir: string
  /** 文件映射列表 */
  files: FileMappingType[]
}
