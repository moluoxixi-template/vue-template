/**
 * Vite 配置渲染器
 * 数据驱动的 vite.config.ts 生成
 */

import type { ProjectConfigType, TemplateContextType, ViteConfigDataType } from '../types'

/**
 * 聚合 Vite 配置数据
 * @param config 项目配置
 */
export function aggregateViteConfigData(config: ProjectConfigType): ViteConfigDataType {
  const imports: Array<[string, string]> = []
  const plugins: string[] = []
  const configObj: Record<string, unknown> = {}

  // Sentry 插件
  if (config.sentry) {
    imports.push(['sentryVitePlugin', '@sentry/vite-plugin'])
    plugins.push(`viteEnv.VITE_SENTRY && mode === 'production' && sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'f1f562b9b82f',
      project: 'javascript-vue',
      sourcemaps: {
        assets: './dist/**',
        ignore: ['node_modules'],
      },
      release: {
        name: viteEnv.VITE_APP_VERSION || 'unknown',
      },
    })`)
  }

  // 文件系统路由
  if (config.routeMode === 'file-system') {
    configObj.pageRoutes = true
  }

  return {
    imports,
    plugins,
    config: configObj,
  }
}

/**
 * 获取 Vite 配置渲染上下文
 * @param config 项目配置
 */
export function getViteConfigContext(config: ProjectConfigType): TemplateContextType {
  const viteData = aggregateViteConfigData(config)

  return {
    ...config,
    isElementPlus: config.uiLibrary === 'element-plus',
    isAntDesignVue: config.uiLibrary === 'ant-design-vue',
    isAntDesign: config.uiLibrary === 'ant-design',
    isPageRoutes: config.routeMode === 'file-system',
    enabledFeatures: [],
    // Vite 配置数据
    viteImports: viteData.imports,
    vitePlugins: viteData.plugins,
    viteConfig: viteData.config,
  } as TemplateContextType
}
