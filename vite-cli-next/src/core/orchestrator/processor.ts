/**
 * 中央配置处理器
 * 负责聚合、去重、排序、冲突解决等核心逻辑
 */

import type {
  ESLintConfigFragment,
  FeatureDeclaration,
  ImportDeclaration,
  ProcessedTemplateData,
  SetupHook,
  ViteConfigFragment,
  VitePluginDeclaration,
} from './types'
import { isObject, mergeWith } from 'lodash-es'

/**
 * 格式化 Import 声明为字符串
 */
function formatImport(declaration: ImportDeclaration): string {
  const { from, default: defaultImport, named, typeOnly } = declaration
  const importKeyword = typeOnly ? 'import type' : 'import'

  if (defaultImport && !named) {
    return `${importKeyword} ${defaultImport} from '${from}'`
  }

  if (named && named.length > 0) {
    const namedList = named.join(', ')
    return typeOnly
      ? `${importKeyword} { ${namedList} } from '${from}'`
      : `${importKeyword} { ${namedList} } from '${from}'`
  }

  return `import '${from}'`
}

/**
 * 去重并排序 Import 声明
 */
function dedupeAndSortImports(imports: ImportDeclaration[]): ImportDeclaration[] {
  // 按 from 路径去重（保留优先级最高的）
  const importMap = new Map<string, ImportDeclaration>()

  for (const imp of imports) {
    const existing = importMap.get(imp.from)
    if (!existing || (imp.priority ?? 999) < (existing.priority ?? 999)) {
      importMap.set(imp.from, imp)
    }
  }

  // 转换为数组并按优先级排序
  return Array.from(importMap.values()).sort((a, b) => {
    const priorityA = a.priority ?? 999
    const priorityB = b.priority ?? 999
    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }
    // 相同优先级按 from 路径字母排序
    return a.from.localeCompare(b.from)
  })
}

/**
 * 拓扑排序 Setup Hooks（处理依赖关系）
 */
function topologicalSortHooks(hooks: SetupHook[]): SetupHook[] {
  const hookMap = new Map<string, SetupHook>(hooks.map(h => [h.name, h]))
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const result: SetupHook[] = []

  function visit(hook: SetupHook): void {
    if (visiting.has(hook.name)) {
      // 检测循环依赖
      throw new Error(`Circular dependency detected in setup hooks: ${hook.name}`)
    }
    if (visited.has(hook.name)) {
      return
    }

    visiting.add(hook.name)

    // 先访问依赖
    if (hook.deps) {
      for (const depName of hook.deps) {
        const dep = hookMap.get(depName)
        if (dep) {
          visit(dep)
        }
      }
    }

    visiting.delete(hook.name)
    visited.add(hook.name)
    result.push(hook)
  }

  // 按 order 排序后访问
  const sortedHooks = [...hooks].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  for (const hook of sortedHooks) {
    if (!visited.has(hook.name)) {
      visit(hook)
    }
  }

  return result
}

/**
 * 处理条件表达式（简单的变量替换）
 */
function evaluateCondition(condition: string | undefined, context: Record<string, unknown>): boolean {
  if (!condition) {
    return true
  }

  // 简单的变量替换评估
  // 例如：qiankun ? 'props' : '{}' -> 如果 qiankun 为 true，返回 'props'
  if (condition.includes('qiankun')) {
    const qiankun = Boolean(context.qiankun)
    return condition.includes(`qiankun ?`) ? qiankun : !qiankun
  }

  return true
}

/**
 * 替换代码中的占位符
 */
function replacePlaceholders(code: string, context: Record<string, unknown>): string {
  // 替换 {{QIANKUN_PLACEHOLDER}}
  if (code.includes('{{QIANKUN_PLACEHOLDER}}')) {
    return code.replace('{{QIANKUN_PLACEHOLDER}}', Boolean(context.qiankun) ? 'props' : '{}')
  }

  return code
}

/**
 * 合并 Vite Config 片段
 */
function mergeViteConfigs(fragments: ViteConfigFragment[]): Record<string, unknown> {
  const result: Record<string, unknown> = {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
          api: 'modern-compiler',
        },
      },
    },
  }

  for (const fragment of fragments) {
    const keys = fragment.path.split('.')
    let current: Record<string, unknown> = result

    // 创建嵌套路径
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {}
      }
      current = current[key] as Record<string, unknown>
    }

    const lastKey = keys[keys.length - 1]
    if (fragment.strategy === 'replace' || !(lastKey in current)) {
      current[lastKey] = fragment.value
    }
    else {
      // 深度合并
      if (isObject(current[lastKey]) && isObject(fragment.value)) {
        current[lastKey] = mergeWith(
          {},
          current[lastKey] as Record<string, unknown>,
          fragment.value as Record<string, unknown>,
        )
      }
      else {
        current[lastKey] = fragment.value
      }
    }
  }

  return result
}

/**
 * 中央配置处理器
 */
export function processFeatureDeclarations(
  features: FeatureDeclaration[],
  config: Record<string, unknown>,
): ProcessedTemplateData {
  // 收集所有声明
  const allTypeImports: ImportDeclaration[] = []
  const allImports: ImportDeclaration[] = []
  const allStyles: ImportDeclaration[] = []
  const allHooks: SetupHook[] = []
  const allVitePlugins: VitePluginDeclaration[] = []
  const allViteConfigs: ViteConfigFragment[] = []
  const allESLintConfigs: ESLintConfigFragment[] = []

  // 遍历所有启用的 Feature
  for (const feature of features) {
    if (!feature.enabled(config)) {
      continue
    }

    // 收集 main.ts/tsx 声明
    if (feature.main) {
      if (feature.main.imports) {
        for (const imp of feature.main.imports) {
          if (imp.typeOnly) {
            allTypeImports.push(imp)
          }
          else {
            allImports.push(imp)
          }
        }
      }
      if (feature.main.styles) {
        allStyles.push(...feature.main.styles)
      }
      if (feature.main.hooks) {
        allHooks.push(...feature.main.hooks)
      }
    }

    // 收集 vite.config.ts 声明
    if (feature.vite) {
      if (feature.vite.plugins) {
        allVitePlugins.push(...feature.vite.plugins)
      }
      if (feature.vite.configs) {
        allViteConfigs.push(...feature.vite.configs)
      }
    }

    // 收集 eslint.config.ts 声明
    if (feature.eslint?.configs) {
      allESLintConfigs.push(...feature.eslint.configs)
    }
  }

  // 添加框架基础导入
  if (config.framework === 'vue') {
    allTypeImports.unshift({
      from: 'vue',
      named: ['App'],
      typeOnly: true,
      priority: 0,
    })
    allImports.unshift({
      from: 'vue',
      named: ['createApp'],
      priority: 1,
    })
    allImports.push({
      from: './App.vue',
      default: 'App',
      priority: 999,
    })
  }
  else if (config.framework === 'react') {
    allImports.unshift({
      from: 'react',
      named: ['StrictMode'],
      priority: 1,
    })
    allImports.unshift({
      from: 'react-dom/client',
      named: ['createRoot'],
      priority: 2,
    })
    // 根据路由模式添加路由导入
    const routeMode = config.routeMode as string
    if (routeMode === 'file-system') {
      allImports.push({
        from: 'react-router-dom',
        named: ['BrowserRouter'],
        priority: 100,
      })
      allImports.push({
        from: './App',
        default: 'App',
        priority: 999,
      })
    }
    else {
      allImports.push({
        from: 'react-router-dom',
        named: ['RouterProvider'],
        priority: 100,
      })
      allImports.push({
        from: './router',
        named: ['router'],
        priority: 100,
      })
    }
  }

  // 添加通用样式
  allStyles.push({
    from: '@/assets/styles/main.scss',
    priority: 998,
  })
  allStyles.push({
    from: '@/assets/fonts/index.css',
    priority: 999,
  })

  // 处理 Import：去重、排序
  const processedTypeImports = dedupeAndSortImports(allTypeImports)
  const processedImports = dedupeAndSortImports(allImports)
  const processedStyles = dedupeAndSortImports(allStyles)

  // 处理 Hooks：拓扑排序、条件评估、占位符替换
  const sortedHooks = topologicalSortHooks(allHooks)
  const processedInits = sortedHooks
    .filter(hook => evaluateCondition(hook.condition, config))
    .map(hook => {
      const code = replacePlaceholders(hook.code, config)
      // 处理多行代码：按行分割，每行保持原有缩进（在模板中会整体缩进）
      return code
    })
    .flatMap(init => init.split('\n'))

  // 处理 React 渲染代码（根据路由模式生成）
  let renderCode: string | undefined
  if (config.framework === 'react') {
    const routeMode = config.routeMode as string
    if (routeMode === 'file-system') {
      renderCode = `root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )`
    }
    else {
      renderCode = `root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )`
    }
  }

  // 处理 Vite Plugins：排序并过滤空值
  const sortedPlugins = [...allVitePlugins].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  const processedViteImports = dedupeAndSortImports(
    sortedPlugins.map(p => p.import),
  )
  // 过滤掉可能为 undefined 的插件（条件表达式的结果）
  const processedVitePlugins = sortedPlugins
    .map(p => p.instantiate)
    .filter(p => p && p.trim())

  // 处理 Vite Configs：合并
  const mergedViteConfig = mergeViteConfigs(allViteConfigs)

  // 处理 ESLint Configs：排序并合并
  const sortedESLintConfigs = [...allESLintConfigs].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999),
  )
  const baseESLintConfig: Record<string, unknown> = {
    ignores: [],
    rules: {
      'perfectionist/sort-imports': 'off',
      'jsonc/sort-keys': 'off',
    },
  }

  if (config.framework === 'react') {
    baseESLintConfig.vue = false
    baseESLintConfig.react = true
  }

  const processedESLintConfigs = [baseESLintConfig, ...sortedESLintConfigs.map(c => c.config)]

  // 生成 eslint.config.ts 文件内容（无需 EJS 模板）
  const eslintConfigContent = generateESLintConfigFile(processedESLintConfigs)

  // 格式化为最终输出
  return {
    config,
    main: {
      typeImports: processedTypeImports.map(formatImport),
      imports: processedImports.map(formatImport),
      styles: processedStyles.map(formatImport),
      inits: processedInits,
      qiankun: Boolean(config.qiankun),
      renderCode,
    },
    vite: {
      imports: processedViteImports.map(formatImport),
      plugins: processedVitePlugins,
      config: mergedViteConfig,
      // 添加格式化的配置字符串，用于模板渲染
      formattedCssConfig: mergedViteConfig.css?.preprocessorOptions
        ? formatConfigObject(mergedViteConfig.css.preprocessorOptions, 12)
        : undefined,
    },
    eslint: {
      configBlocks: processedESLintConfigs,
      fileContent: eslintConfigContent, // 直接生成文件内容
    },
  }
}

/**
 * 生成 eslint.config.ts 文件内容
 */
function generateESLintConfigFile(configBlocks: Array<Record<string, unknown>>): string {
  const configArgs = configBlocks
    .map(block => JSON.stringify(block, null, 2))
    .map((json, index) => {
      const lines = json.split('\n')
      const indented = lines.map((line, i) => (i === 0 ? line : `  ${line}`)).join('\n')
      return `${indented}${index < configBlocks.length - 1 ? ',' : ''}`
    })
    .join('\n')

  return `/**
 * ESLint 配置
 * 使用 @moluoxixi/eslint-config 进行代码规范检查
 */

import eslintConfig from '@moluoxixi/eslint-config'

export default eslintConfig(
${configArgs}
)
`
}

