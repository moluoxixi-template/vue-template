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
} from './types.ts'
import { isObject, mergeWith } from 'lodash-es'

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

function dedupeAndSortImports(imports: ImportDeclaration[]): ImportDeclaration[] {
  const importMap = new Map<string, ImportDeclaration>()

  for (const imp of imports) {
    const existing = importMap.get(imp.from)
    if (!existing || (imp.priority ?? 999) < (existing.priority ?? 999)) {
      importMap.set(imp.from, imp)
    }
  }

  return Array.from(importMap.values()).sort((a, b) => {
    const priorityA = a.priority ?? 999
    const priorityB = b.priority ?? 999
    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }
    return a.from.localeCompare(b.from)
  })
}

function topologicalSortHooks(hooks: SetupHook[]): SetupHook[] {
  const hookMap = new Map<string, SetupHook>(hooks.map(h => [h.name, h]))
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const result: SetupHook[] = []

  function visit(hook: SetupHook): void {
    if (visiting.has(hook.name)) {
      throw new Error(`Circular dependency detected in setup hooks: ${hook.name}`)
    }
    if (visited.has(hook.name)) {
      return
    }

    visiting.add(hook.name)

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

  const sortedHooks = [...hooks].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  for (const hook of sortedHooks) {
    if (!visited.has(hook.name)) {
      visit(hook)
    }
  }

  return result
}

function evaluateCondition(condition: string | undefined, context: Record<string, unknown>): boolean {
  if (!condition) {
    return true
  }

  if (condition.includes('qiankun')) {
    const qiankun = Boolean(context.qiankun)
    return condition.includes('qiankun ?') ? qiankun : !qiankun
  }

  return true
}

function replacePlaceholders(code: string, context: Record<string, unknown>): string {
  if (code.includes('{{QIANKUN_PLACEHOLDER}}')) {
    return code.replace('{{QIANKUN_PLACEHOLDER}}', context.qiankun ? 'props' : '{}')
  }

  return code
}

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

export function processFeatureDeclarations(
  features: FeatureDeclaration[],
  config: Record<string, unknown>,
): ProcessedTemplateData {
  const allTypeImports: ImportDeclaration[] = []
  const allImports: ImportDeclaration[] = []
  const allStyles: ImportDeclaration[] = []
  const allHooks: SetupHook[] = []
  const allVitePlugins: VitePluginDeclaration[] = []
  const allViteConfigs: ViteConfigFragment[] = []
  const allESLintConfigs: ESLintConfigFragment[] = []

  for (const feature of features) {
    if (!feature.enabled(config)) {
      continue
    }

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

    if (feature.vite) {
      if (feature.vite.plugins) {
        allVitePlugins.push(...feature.vite.plugins)
      }
      if (feature.vite.configs) {
        allViteConfigs.push(...feature.vite.configs)
      }
    }

    if (feature.eslint?.configs) {
      allESLintConfigs.push(...feature.eslint.configs)
    }
  }

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
  }
  else if (config.framework === 'react') {
    allImports.unshift(
      {
        from: 'react',
        named: ['StrictMode'],
        priority: 0,
      },
      {
        from: 'react-dom/client',
        named: ['createRoot'],
        priority: 1,
      },
    )
    allTypeImports.unshift({
      from: 'react',
      named: ['StrictMode'],
      typeOnly: true,
      priority: 0,
    })
  }

  const processedTypeImports = dedupeAndSortImports(allTypeImports).map(formatImport)
  const processedImports = dedupeAndSortImports(allImports).map(formatImport)
  const processedStyles = dedupeAndSortImports(allStyles).map(formatImport)

  const sortedHooks = topologicalSortHooks(allHooks)
  const processedInits = sortedHooks
    .filter(hook => evaluateCondition(hook.condition, config))
    .map((hook) => {
      const code = replacePlaceholders(hook.code, config)
      return code
    })
    .flatMap(init => init.split('\n'))

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

  const sortedPlugins = [...allVitePlugins].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  const processedViteImports = dedupeAndSortImports(
    sortedPlugins.map(p => p.import),
  )
  const processedVitePlugins = sortedPlugins
    .map(p => p.instantiate)
    .filter(p => p && p.trim())

  const mergedViteConfig = mergeViteConfigs(allViteConfigs)

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
  const eslintConfigContent = generateESLintConfigFile(processedESLintConfigs)

  return {
    config,
    main: {
      typeImports: processedTypeImports,
      imports: processedImports,
      styles: processedStyles,
      inits: processedInits,
      qiankun: !!config.qiankun,
      renderCode,
    },
    vite: {
      imports: processedViteImports.map(formatImport),
      plugins: processedVitePlugins,
      config: mergedViteConfig,
      formattedCssConfig: JSON.stringify(mergedViteConfig.css, null, 2),
    },
    eslint: {
      configBlocks: processedESLintConfigs,
      fileContent: eslintConfigContent,
    },
  }
}

function generateESLintConfigFile(configBlocks: Array<Record<string, unknown>>): string {
  const configArg = configBlocks.length === 1
    ? JSON.stringify(configBlocks[0], null, 2)
    : `[${configBlocks.map(block => JSON.stringify(block, null, 2)).join(',\n')}]`

  return `import eslintConfig from '@moluoxixi/eslint-config'

export default eslintConfig(${configArg})
`
}
