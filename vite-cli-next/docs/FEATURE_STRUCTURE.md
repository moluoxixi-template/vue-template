# Feature 模块文件结构规范

## 核心原则

**文件路径对应原则**：Feature 模块中的文件路径应该与生成的文件路径保持一致，方便查阅和维护。

## 目录结构

```
features/
└── vue/
    └── qiankun/
        ├── index.ts                    # 主入口，聚合各个配置片段
        ├── src/
        │   └── main.ts.data.ts         # main.ts 的配置片段（对应生成文件：src/main.ts）
        └── vite.config.ts.data.ts      # vite.config.ts 的配置片段（对应生成文件：vite.config.ts）
```

## 文件命名规范

### 配置片段文件
- **格式**：`<目标文件路径>.data.ts`
- **示例**：
  - `src/main.ts.data.ts` → 对应生成 `src/main.ts` 的内容
  - `vite.config.ts.data.ts` → 对应生成 `vite.config.ts` 的内容
  - `eslint.config.ts.data.ts` → 对应生成 `eslint.config.ts` 的内容

### 主入口文件
- **固定名称**：`index.ts`
- **职责**：聚合各个配置片段，导出 `FeatureDeclaration`

## 示例

### 1. 简单 Feature（只有 main.ts 配置）

```
features/vue/qiankun/
├── index.ts
└── src/
    └── main.ts.data.ts
```

**index.ts**:
```typescript
import type { FeatureDeclaration } from '../../../core/orchestrator/types'
import * as mainData from './src/main.ts.data'

export default {
  name: 'qiankun',
  enabled: (config) => Boolean(config.qiankun),
  main: {
    imports: mainData.imports,
  },
} satisfies FeatureDeclaration
```

**src/main.ts.data.ts**:
```typescript
import type { ImportDeclaration } from '../../../../core/orchestrator/types'

export const imports: ImportDeclaration[] = [
  {
    from: 'vite-plugin-qiankun/dist/helper',
    named: ['QiankunProps'],
    typeOnly: true,
    priority: 10,
  },
]
```

### 2. 复杂 Feature（多个文件配置）

```
features/vue/sentry/
├── index.ts
├── src/
│   └── main.ts.data.ts
└── vite.config.ts.data.ts
```

**index.ts**:
```typescript
import type { FeatureDeclaration } from '../../../core/orchestrator/types'
import * as mainData from './src/main.ts.data'
import * as viteData from './vite.config.ts.data'

export default {
  name: 'sentry',
  enabled: (config) => Boolean(config.sentry),
  main: {
    imports: mainData.imports,
    hooks: mainData.hooks,
  },
  vite: {
    plugins: viteData.plugins,
  },
} satisfies FeatureDeclaration
```

## 优势

1. **结构一致性**：Feature 模块结构与生成的文件结构一一对应
2. **易于查阅**：想修改 `src/main.ts` 的配置？直接看 `src/main.ts.data.ts`
3. **物理隔离**：每个配置片段独立文件，职责清晰
4. **易于维护**：新增配置片段只需添加新文件，无需修改现有文件

## 迁移指南

### 从旧结构迁移

**旧结构**：
```typescript
// features/vue/qiankun/index.ts
export default {
  main: {
    imports: [/* ... */],
  },
}
```

**新结构**：
```typescript
// features/vue/qiankun/src/main.ts.data.ts
export const imports: [/* ... */]

// features/vue/qiankun/index.ts
import * as mainData from './src/main.ts.data'
export default {
  main: {
    imports: mainData.imports,
  },
}
```

