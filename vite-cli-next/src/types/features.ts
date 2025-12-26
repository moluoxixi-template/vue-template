/**
 * 特性配置定义
 * 定义所有可用特性及其元数据
 */

import type { FeatureMetadataType, ProjectConfigType, ViteConfigDataType } from './index'

/**
 * @moluoxixi 核心依赖配置
 * 这些依赖必须在所有项目中存在
 */
export const MOLUOXIXI_DEPS = {
  '@moluoxixi/eslint-config': 'latest',
  '@moluoxixi/vite-config': 'latest',
  '@moluoxixi/ajax-package': 'latest',
  '@moluoxixi/class-names': 'latest',
  '@moluoxixi/css-module-global-root-plugin': 'latest',
} as const

/**
 * 路由特性元数据
 */
export const routerFeature: FeatureMetadataType = {
  id: 'router',
  name: 'Vue Router / React Router',
  description: '路由管理',
  affectsWorkspace: true,
  packageDeps: {
    dependencies: {
      'vue-router': 'catalog:build',
    },
  },
  mainTsHooks: {
    imports: ['import router from \'@/router\''],
    appUse: ['app.use(router)'],
  },
}

/**
 * Pinia 状态管理特性元数据
 */
export const piniaFeature: FeatureMetadataType = {
  id: 'pinia',
  name: 'Pinia',
  description: 'Vue 状态管理',
  affectsWorkspace: true,
  packageDeps: {
    dependencies: {
      'pinia': 'catalog:build',
      'pinia-plugin-persistedstate': 'catalog:build',
    },
  },
  mainTsHooks: {
    imports: ['import { store } from \'@/stores\''],
    appUse: ['app.use(store)'],
  },
}

/**
 * 国际化特性元数据
 */
export const i18nFeature: FeatureMetadataType = {
  id: 'i18n',
  name: 'i18n',
  description: '国际化支持',
  affectsWorkspace: true,
  packageDeps: {
    dependencies: {
      'vue-i18n': 'catalog:build',
    },
  },
  mainTsHooks: {
    imports: ['import i18n from \'@/locales\''],
    appUse: ['app.use(i18n)'],
  },
}

/**
 * Sentry 错误监控特性元数据
 */
export const sentryFeature: FeatureMetadataType = {
  id: 'sentry',
  name: 'Sentry',
  description: '错误监控',
  affectsWorkspace: true,
  packageDeps: {
    dependencies: {
      '@sentry/vue': 'catalog:build',
      '@sentry/vite-plugin': 'catalog:build',
    },
  },
  mainTsHooks: {
    imports: ['import { initSentry } from \'@/utils/sentry\''],
    init: ['initSentry(app, router)'],
  },
  viteConfigData: function getSentryViteConfig(_config: ProjectConfigType): ViteConfigDataType {
    return {
      imports: [['sentryVitePlugin', '@sentry/vite-plugin']],
      plugins: [
        `viteEnv.VITE_SENTRY && mode === 'production' && sentryVitePlugin({
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
        })`,
      ],
      config: {},
    }
  },
}

/**
 * Qiankun 微前端特性元数据
 */
export const qiankunFeature: FeatureMetadataType = {
  id: 'qiankun',
  name: 'Qiankun',
  description: '微前端支持',
  affectsWorkspace: true,
  packageDeps: {
    dependencies: {
      'vite-plugin-qiankun': 'catalog:build',
    },
  },
}

/**
 * 文件系统路由特性元数据
 */
export const pageRoutesFeature: FeatureMetadataType = {
  id: 'pageRoutes',
  name: 'File System Routes',
  description: '基于文件系统的路由',
  dependencies: ['router'],
  affectsWorkspace: true,
  packageDeps: {
    dependencies: {
      'vite-plugin-pages': 'catalog:build',
    },
  },
  viteConfigData: function getPageRoutesViteConfig(_config: ProjectConfigType): ViteConfigDataType {
    return {
      imports: [],
      plugins: [],
      config: {
        pageRoutes: true,
      },
    }
  },
}

/**
 * UI 库特性元数据
 */
export const uiLibraryFeature: FeatureMetadataType = {
  id: 'uiLibrary',
  name: 'UI Library',
  description: 'UI 组件库',
  affectsWorkspace: true,
}

/**
 * 所有特性列表
 */
export const ALL_FEATURES: FeatureMetadataType[] = [
  routerFeature,
  piniaFeature,
  i18nFeature,
  sentryFeature,
  qiankunFeature,
  pageRoutesFeature,
  uiLibraryFeature,
]

/**
 * 根据配置获取启用的特性列表
 */
export function getEnabledFeatures(config: ProjectConfigType): FeatureMetadataType[] {
  const enabled: FeatureMetadataType[] = []

  // Router 始终启用
  enabled.push(routerFeature)

  // Pinia 始终启用（Vue）/ Zustand（React）
  if (config.framework === 'vue') {
    enabled.push(piniaFeature)
  }

  // 文件系统路由
  if (config.routeMode === 'file-system') {
    enabled.push(pageRoutesFeature)
  }

  // i18n
  if (config.i18n) {
    enabled.push(i18nFeature)
  }

  // Sentry
  if (config.sentry) {
    enabled.push(sentryFeature)
  }

  // Qiankun
  if (config.qiankun) {
    enabled.push(qiankunFeature)
  }

  // UI Library
  enabled.push(uiLibraryFeature)

  return enabled
}
