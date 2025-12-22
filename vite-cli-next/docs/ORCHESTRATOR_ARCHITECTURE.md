# 中央配置处理器架构设计文档

## 一、架构流向图

```
用户配置 (ProjectConfig)
    ↓
Feature 模块声明 (FeatureDeclaration)
    ↓
中央配置处理器 (Orchestrator)
    ├─ 去重 (Deduplication)
    ├─ 排序 (Sorting)
    ├─ 依赖解析 (Dependency Resolution)
    ├─ 冲突解决 (Conflict Resolution)
    └─ 格式转换 (Format Transformation)
    ↓
处理后的模板数据 (ProcessedTemplateData)
    ↓
EJS 模板渲染 (Zero-Logic Templates)
    ↓
生成的代码文件
```

## 二、核心组件

### 2.1 Feature 声明化 (Feature Declaration)

每个 Feature 只声明元数据，不拼接字符串：

```typescript
export default {
  name: 'router',
  enabled: (config) => true,
  main: {
    imports: [
      {
        from: './router',
        default: 'getRouter',
        priority: 100,
      },
    ],
    hooks: [
      {
        name: 'router-init',
        code: 'const router = getRouter({{QIANKUN_PLACEHOLDER}})',
        order: 20,
        deps: [],
      },
    ],
  },
} satisfies FeatureDeclaration
```

### 2.2 中央处理器 (Orchestrator)

负责统一处理所有 Feature 声明：

```typescript
function processFeatureDeclarations(
  features: FeatureDeclaration[],
  config: Record<string, unknown>,
): ProcessedTemplateData {
  // 1. 收集所有声明
  // 2. 去重 Import
  // 3. 拓扑排序 Hooks（处理依赖）
  // 4. 合并配置片段
  // 5. 格式化为最终输出
}
```

### 2.3 处理流程

#### Import 处理
- **去重**：按 `from` 路径去重，保留优先级最高的
- **排序**：按 `priority` 排序，相同优先级按字母排序
- **格式化**：将 `ImportDeclaration` 转换为字符串

#### Hook 处理
- **拓扑排序**：根据 `deps` 依赖关系排序
- **条件评估**：评估 `condition` 表达式
- **占位符替换**：替换代码中的占位符（如 `{{QIANKUN_PLACEHOLDER}}`）

#### Config 处理
- **路径解析**：将 `path: 'css.preprocessorOptions.scss'` 解析为嵌套对象
- **合并策略**：支持 `merge`（深度合并）和 `replace`（替换）

## 三、数据模型

### 3.1 ImportDeclaration

```typescript
interface ImportDeclaration {
  from: string                    // 导入来源
  default?: string                // 默认导入
  named?: string[]                // 命名导入
  namespace?: string              // 命名空间导入
  typeOnly?: boolean              // 类型导入
  priority?: number               // 优先级（越小越先）
}
```

### 3.2 SetupHook

```typescript
interface SetupHook {
  name: string                    // Hook 名称
  code: string                    // 代码片段
  order?: number                  // 执行顺序
  deps?: string[]                 // 依赖的 Hook
  condition?: string              // 条件表达式
}
```

### 3.3 ViteConfigFragment

```typescript
interface ViteConfigFragment {
  path: string                    // 配置路径（如 'css.preprocessorOptions.scss'）
  value: unknown                  // 配置值
  strategy?: 'merge' | 'replace'  // 合并策略
}
```

## 四、处理示例

### 场景：Vue + Router + Sentry + Element Plus

#### 输入 Feature 声明
```typescript
[
  {
    name: 'router',
    main: {
      hooks: [
        { name: 'router-init', code: 'const router = getRouter({{QIANKUN_PLACEHOLDER}})', order: 20 },
        { name: 'router-install', code: 'app.use(router)', order: 25, deps: ['router-init'] },
      ],
    },
  },
  {
    name: 'sentry',
    main: {
      hooks: [
        { name: 'sentry-init', code: 'initSentry(app, router)', order: 15, deps: ['router-init'] },
      ],
    },
  },
]
```

#### 处理器输出
```typescript
{
  main: {
    inits: [
      'const router = getRouter({})',  // 占位符已替换
      'initSentry(app, router)',       // 依赖 router-init，自动排序
      'app.use(router)',               // 依赖 router-init，自动排序
    ],
  },
}
```

**执行顺序**：
1. `router-init` (order: 20)
2. `sentry-init` (order: 15, 但依赖 `router-init`，所以在其后)
3. `router-install` (order: 25, 依赖 `router-init`)

## 五、优势

1. **高内聚低耦合**：Feature 只声明需求，处理器统一处理
2. **可扩展性强**：新增 Feature 只需声明，无需修改处理器
3. **类型安全**：所有数据结构都有 TypeScript 类型
4. **易于测试**：处理器逻辑可独立单元测试
5. **模板零逻辑**：模板只负责展开，易于维护

