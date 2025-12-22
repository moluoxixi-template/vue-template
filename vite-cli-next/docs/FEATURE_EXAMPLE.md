# Feature 模块声明示例

## UnoCSS Feature 示例

展示如何"申报" UnoCSS 的配置，而不是如何"写"代码：

```typescript
// src/features/vue/unocss/index.ts
import type { FeatureDeclaration } from '../../../core/orchestrator/types'

export default {
  name: 'unocss',
  enabled: (config: Record<string, unknown>) => Boolean(config.unocss),
  main: {
    imports: [
      {
        from: 'uno.css',
        priority: 1, // 最高优先级，最先导入
      },
    ],
  },
  vite: {
    plugins: [
      {
        name: 'unocss',
        import: {
          from: 'unplugin-vue-components/resolvers',
          named: ['UnoCSSResolver'],
          priority: 100,
        },
        instantiate: 'UnoCSS()',
        order: 5,
      },
    ],
    configs: [
      {
        path: 'css.preprocessorOptions.scss',
        strategy: 'merge',
        value: {
          // UnoCSS 特定的 SCSS 配置
        },
      },
    ],
  },
} satisfies FeatureDeclaration
```

**关键点**：
- ✅ 只声明元数据，不拼接字符串
- ✅ 使用 `priority` 控制导入顺序
- ✅ 使用 `order` 控制插件执行顺序
- ✅ 使用 `strategy` 控制配置合并方式

## Vitest Feature 示例

```typescript
// src/features/vue/vitest/index.ts
import type { FeatureDeclaration } from '../../../core/orchestrator/types'

export default {
  name: 'vitest',
  enabled: (config: Record<string, unknown>) => Boolean(config.vitest),
  vite: {
    configs: [
      {
        path: 'test',
        strategy: 'replace',
        value: {
          globals: true,
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{js,ts}'],
        },
      },
    ],
  },
} satisfies FeatureDeclaration
```

**生成效果**：

```typescript
// vite.config.ts
export default defineConfig({
  // ... 其他配置
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
})
```

