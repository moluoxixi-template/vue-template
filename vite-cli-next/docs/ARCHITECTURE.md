# Vite CLI Next 架构文档

## 原子化分层叠加架构 (Atomic Layered Overlay Architecture)

本 CLI 采用三层模板架构，实现模块化、可维护的项目生成器。

## 目录结构

```
vite-cli-next/
├── src/
│   ├── commands/          # CLI 命令
│   │   ├── create.ts      # create 命令实现
│   │   └── index.ts
│   ├── generators/        # 项目生成器
│   │   ├── project.ts     # 项目生成入口
│   │   ├── vue.ts         # Vue 项目生成器
│   │   ├── react.ts       # React 项目生成器
│   │   └── index.ts
│   ├── utils/             # 工具函数
│   │   ├── file.ts        # 文件操作
│   │   ├── merge.ts       # 配置合并
│   │   ├── prompts.ts     # 交互提示
│   │   ├── install.ts     # 依赖安装
│   │   ├── template.ts    # 模板渲染
│   │   └── index.ts
│   ├── types/             # 类型定义
│   │   └── index.ts
│   ├── index.ts           # CLI 入口
│   └── test.ts            # 产物审计测试
├── templates/
│   ├── base/              # L0: 跨框架通用模板
│   ├── vue/
│   │   ├── base/          # L1: Vue 母版模板
│   │   └── features/      # L2: Vue 原子特性
│   └── react/
│       ├── base/          # L1: React 母版模板
│       └── features/      # L2: React 原子特性
└── docs/
    └── ARCHITECTURE.md    # 架构文档
```

## 模板层级说明

### L0 - 跨框架通用模板 (`templates/base/`)

包含所有框架共用的基础配置文件：

| 文件/目录 | 说明 | @moluoxixi 依赖 |
|-----------|------|-----------------|
| `.gitignore` | Git 忽略配置 | - |
| `.npmrc` | NPM 配置 | - |
| `.cz-config.cjs` | Commitizen 配置 | - |
| `commitlint.config.ts` | Commit 规范配置 | - |
| `.husky/` | Git Hooks 配置 | - |
| `.env*` | 环境变量配置 | - |
| `scripts/build.mts` | 构建脚本 | - |
| `src/assets/` | 公共样式和字体 | - |
| `src/apis/` | API 请求层 | `@moluoxixi/ajax-package` |
| `src/constants/` | 常量定义 | - |
| `src/utils/` | 工具函数 | - |
| `src/locales/lang/` | 多语言文件 | - |

### L1 - Vue 母版模板 (`templates/vue/base/`)

Vue 3 项目的核心模板文件：

| 文件/目录 | 说明 | @moluoxixi 依赖 |
|-----------|------|-----------------|
| `package.json` | 项目依赖配置 | `@moluoxixi/eslint-config`, `@moluoxixi/vite-config`, `@moluoxixi/ajax-package` |
| `pnpm-workspace.yaml` | pnpm 工作区配置 | 所有 `@moluoxixi/*@latest` |
| `vite.config.ts` | Vite 构建配置 | `@moluoxixi/vite-config`, `@moluoxixi/css-module-global-root-plugin` |
| `eslint.config.ts` | ESLint 配置 | `@moluoxixi/eslint-config` |
| `tsconfig*.json` | TypeScript 配置 | - |
| `env.d.ts` | 环境变量类型声明 | - |
| `index.html` | HTML 入口 | - |
| `src/App.vue` | 根组件 | - |
| `src/router/` | 路由配置 | - |
| `src/stores/` | Pinia 状态管理 | - |
| `src/directives/` | Vue 指令 | - |
| `src/locales/index.ts` | i18n 配置入口 | - |
| `src/layouts/` | 布局组件 | - |
| `src/pages/` | 页面组件 | - |
| `src/components/` | 公共组件 | - |
| `src/utils/sentry.ts` | Sentry 配置 | - |
| `src/assets/styles/element/` | Element Plus 样式 | - |

### L1 - React 母版模板 (`templates/react/base/`)

React 18 项目的核心模板文件：

| 文件/目录 | 说明 | @moluoxixi 依赖 |
|-----------|------|-----------------|
| `package.json` | 项目依赖配置 | `@moluoxixi/eslint-config`, `@moluoxixi/vite-config`, `@moluoxixi/ajax-package` |
| `pnpm-workspace.yaml` | pnpm 工作区配置 | 所有 `@moluoxixi/*@latest` |
| `vite.config.ts` | Vite 构建配置 | `@moluoxixi/vite-config`, `@moluoxixi/css-module-global-root-plugin` |
| `eslint.config.ts` | ESLint 配置 | `@moluoxixi/eslint-config` |
| `tsconfig*.json` | TypeScript 配置 | - |
| `src/main.tsx` | 应用入口 | - |
| `src/App.tsx` | 根组件 | - |
| `src/pages/` | 页面组件 | - |
| `src/stores/` | Zustand 状态管理 | - |
| `src/locales/index.ts` | i18n 配置入口 | - |
| `src/utils/sentry.ts` | Sentry 配置 | - |

### L2 - Vue 原子特性 (`templates/vue/features/`)

每个特性目录可包含以下文件：

| 特性目录 | 说明 | 包含文件 |
|----------|------|----------|
| `element-plus/` | Element Plus UI | `package.json`, `pnpm-workspace.yaml`, `vite.config.ts` |
| `ant-design-vue/` | Ant Design Vue UI | `package.json`, `pnpm-workspace.yaml` |
| `i18n/` | 国际化支持 | `package.json`, `pnpm-workspace.yaml`, `main.ts` |
| `sentry/` | 错误监控 | `package.json`, `pnpm-workspace.yaml`, `vite.config.ts`, `main.ts` |
| `qiankun/` | 微前端支持 | `package.json`, `pnpm-workspace.yaml` |
| `pageRoutes/` | 文件系统路由 | `package.json`, `pnpm-workspace.yaml`, `vite.config.ts` |

### L2 - React 原子特性 (`templates/react/features/`)

| 特性目录 | 说明 | 包含文件 |
|----------|------|----------|
| `ant-design/` | Ant Design UI | `package.json`, `pnpm-workspace.yaml` |
| `i18n/` | 国际化支持 | `package.json`, `pnpm-workspace.yaml` |
| `sentry/` | 错误监控 | `package.json`, `pnpm-workspace.yaml` |

## 渲染顺序

模板渲染遵循 **L0 → L1 → L2** 的顺序，后层覆盖前层：

1. **L0 复制**: 复制跨框架通用文件
2. **L1 复制**: 复制框架特定的母版文件
3. **配置合并**: 
   - `package.json`: 深度合并 L1 + 启用的 L2 特性
   - `pnpm-workspace.yaml`: 合并 catalogs
   - `vite.config.ts`: 注入特性配置
   - `main.ts/tsx`: 注入特性初始化代码
4. **条件文件生成**: 根据配置生成 router、locales、sentry 等

## 配置合并规则

### package.json 合并

```typescript
// 深度合并规则
{
  dependencies: { ...base, ...features },
  devDependencies: { ...base, ...features },
  scripts: { ...base, ...features },
}
```

### pnpm-workspace.yaml 合并

```yaml
catalogs:
  build:
    # L1 base + L2 features 合并
  dev:
    # L1 base + L2 features 合并
  type:
    # L1 base + L2 features 合并
```

### vite.config.ts 配置注入

每个 L2 特性可以通过 `vite.config.ts` 导出配置扩展：

```typescript
// templates/vue/features/sentry/vite.config.ts
const config: ViteConfigExtension = {
  imports: [
    ['sentryVitePlugin', '@sentry/vite-plugin'],
  ],
  plugins: [
    `sentryVitePlugin({ ... })`,
  ],
  config: {},
}

export default config
```

### main.ts 逻辑注入

每个 L2 特性可以通过 `main.ts` 导出初始化代码：

```typescript
// templates/vue/features/i18n/main.ts
const config: MainTsExtension = {
  imports: ["import i18n from '@/locales'"],
  appUse: ['app.use(i18n)'],
}

export default config
```

## 必须包含的 @moluoxixi 依赖

以下依赖必须在所有生成的项目中存在：

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| `@moluoxixi/eslint-config` | `latest` | ESLint 配置 |
| `@moluoxixi/vite-config` | `latest` | Vite 配置 |
| `@moluoxixi/ajax-package` | `latest` | HTTP 请求 |
| `@moluoxixi/class-names` | `latest` | CSS 类名工具 |
| `@moluoxixi/css-module-global-root-plugin` | `latest` | CSS Module 插件 |

## CLI 使用方式

### 交互模式

```bash
npx @moluoxixi/create-app
```

### 命令行参数

```bash
npx @moluoxixi/create-app my-project --template vue
```

### 特性选项

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `--framework` | 框架类型 (vue/react) | vue |
| `--ui` | UI 库 | element-plus |
| `--router` | 路由模式 (manual/file-system) | manual |
| `--i18n` | 启用国际化 | true |
| `--sentry` | 启用错误监控 | false |
| `--qiankun` | 启用微前端 (仅 Vue) | false |
| `--pm` | 包管理器 (pnpm/npm/yarn) | pnpm |

## 产物审计

运行测试脚本验证生成的项目：

```bash
pnpm test
```

测试内容：
1. 生成多种配置组合的项目
2. 验证 `@moluoxixi/*` 依赖存在
3. 验证文件结构正确
4. 输出项目文件树

## 扩展指南

### 添加新的 L2 特性

1. 在 `templates/{framework}/features/` 创建特性目录
2. 添加 `package.json` (依赖定义)
3. 添加 `pnpm-workspace.yaml` (版本锁定)
4. 可选: 添加 `vite.config.ts` (Vite 插件)
5. 可选: 添加 `main.ts` (初始化代码)
6. 在 `src/utils/merge.ts` 的 `getFeatureDirs` 添加特性映射

### 添加新框架

1. 在 `templates/` 创建框架目录 (如 `templates/svelte/`)
2. 创建 `base/` 目录放置 L1 母版模板
3. 创建 `features/` 目录放置 L2 特性
4. 在 `src/generators/` 创建框架生成器
5. 在 `src/types/index.ts` 添加框架类型
6. 在 `src/utils/prompts.ts` 添加框架选项
