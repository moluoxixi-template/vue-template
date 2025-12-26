# L0/L1/L2 目录映射表

## L0 - 跨框架通用模板 (templates/base/)

| 文件路径 | 说明 | @moluoxixi 依赖点 |
|----------|------|-------------------|
| `.gitignore` | Git 忽略配置 | - |
| `.npmrc` | NPM 配置 | - |
| `.cz-config.cjs` | Commitizen 配置 | - |
| `commitlint.config.ts` | Commit 规范配置 | - |
| `.env` | 通用环境变量 | - |
| `.env.development` | 开发环境变量 | - |
| `.env.production` | 生产环境变量 | - |
| `.husky/install.mjs` | Husky 安装脚本 | - |
| `.husky/pre-commit` | Pre-commit 钩子 | - |
| `.husky/commit-msg` | Commit-msg 钩子 | - |
| `scripts/build.mts` | 构建脚本 | - |
| `src/apis/request.ts` | 请求封装 | `@moluoxixi/ajax-package` |
| `src/apis/types/*.ts` | API 类型定义 | - |
| `src/apis/services/*.ts` | API 服务 | - |
| `src/assets/styles/base.scss` | 基础样式 | - |
| `src/assets/styles/custom.scss` | 自定义样式 | - |
| `src/assets/styles/tailwind.scss` | Tailwind 导入 | - |
| `src/assets/fonts/index.css` | 字体配置 | - |
| `src/constants/index.ts` | 常量定义 | - |
| `src/locales/lang/*.ts` | 语言包 | - |
| `src/utils/index.ts` | 工具函数 | - |

## L1 - Vue 母版模板 (templates/vue/base/)

| 文件路径 | 说明 | @moluoxixi 依赖点 |
|----------|------|-------------------|
| `package.json.data.ts` | package.json 数据 | `@moluoxixi/eslint-config`, `@moluoxixi/vite-config`, `@moluoxixi/ajax-package`, `@moluoxixi/class-names`, `@moluoxixi/css-module-global-root-plugin` |
| `pnpm-workspace.data.ts` | workspace 数据 | 同上 |
| `vite.config.ts.ejs` | Vite 配置模板 | `@moluoxixi/vite-config`, `@moluoxixi/css-module-global-root-plugin` |
| `main.ts.ejs` | 入口文件模板 | - |
| `eslint.config.ts` | ESLint 配置 | `@moluoxixi/eslint-config` |
| `env.d.ts` | 环境类型声明 | - |
| `index.html` | HTML 入口 | - |
| `tsconfig*.json` | TypeScript 配置 | - |
| `src/App.vue` | 根组件 | - |
| `src/router/index.ts.ejs` | 路由配置模板 | - |
| `src/router/routes.ts` | 路由表 | - |
| `src/router/layout.vue` | 路由布局 | - |
| `src/stores/index.ts` | Pinia 配置 | - |
| `src/stores/modules/*.ts` | Store 模块 | - |
| `src/directives/index.ts` | 指令配置 | - |
| `src/layouts/*.vue` | 布局组件 | - |
| `src/locales/index.ts.ejs` | i18n 配置模板 | - |
| `src/pages/**/*.vue` | 页面组件 | - |
| `src/components/**` | 公共组件 | - |
| `src/assets/styles/main.scss` | 主样式导入 | - |
| `src/assets/styles/element/index.scss` | Element Plus 样式 | - |
| `src/utils/sentry.ts.ejs` | Sentry 配置模板 | - |

## L2 - 原子特性模板 (templates/vue/features/)

### sentry/

| 文件路径 | 说明 | 依赖 |
|----------|------|------|
| `vite.config.data.ts` | Sentry Vite 插件配置 | `@sentry/vite-plugin`, `@sentry/vue` |

**vite.config.data.ts 输出：**
```typescript
{
  imports: [['sentryVitePlugin', '@sentry/vite-plugin']],
  plugins: ['sentryVitePlugin({ ... })'],
  config: {}
}
```

### pageRoutes/

| 文件路径 | 说明 | 依赖 |
|----------|------|------|
| `vite.config.data.ts` | 文件系统路由配置 | `vite-plugin-pages` |

**vite.config.data.ts 输出：**
```typescript
{
  imports: [],
  plugins: [],
  config: { pageRoutes: true }
}
```

## 渲染器说明

### package-json.ts

负责深度合并 package.json：

1. 加载 L1 基础配置 (`getVueBasePackageJson`)
2. 根据特性添加依赖 (`getFeatureDependencies`)
3. 合并并排序 (`mergePackageJson`)
4. 确保 @moluoxixi 依赖存在 (`ensureMoluoxixiDeps`)

### pnpm-workspace.ts

负责生成 pnpm-workspace.yaml：

1. 加载 L1 基础配置 (`getVueBasePnpmWorkspace`)
2. 根据特性添加 catalog 条目
3. 确保 @moluoxixi 依赖在 catalogs 中 (`ensureMoluoxixiCatalogs`)
4. 生成 YAML 格式

### vite-config.ts

负责聚合 Vite 配置数据：

1. 收集所有 L2 特性的 `vite.config.data.ts`
2. 聚合 imports、plugins、config
3. 传递给 EJS 模板渲染

## 特性元数据接口

```typescript
interface FeatureMetadataType {
  id: FeatureFlagType;
  name: string;
  description: string;
  dependencies?: FeatureFlagType[];
  affectsWorkspace: boolean;
  mainTsHooks?: {
    imports?: string[];
    appUse?: string[];
    init?: string[];
    beforeMount?: string[];
  };
  packageDeps?: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  viteConfigData?: (config: ProjectConfigType) => ViteConfigDataType;
}
```

## 自我校验清单

### 提示词自我校验

1. ✅ L0/L1/L2 是否都包含 `@moluoxixi/eslint-config`、`@moluoxixi/vite-config`、`@moluoxixi/ajax-package` 相关模板或依赖声明？
   - L0: `src/apis/request.ts` 使用 `@moluoxixi/ajax-package`
   - L1: `package.json.data.ts` 和 `pnpm-workspace.data.ts` 包含所有依赖
   - L2: 特性模板按需添加依赖

2. ✅ `package.json` 深度合并逻辑是否确保三项依赖始终注入且版本为 `latest`？
   - `ensureMoluoxixiDeps()` 函数确保依赖存在
   - 使用 `catalog:build` 和 `catalog:dev` 引用 workspace catalogs

3. ✅ 产物审计脚本是否检查 `@moluoxixi/*@latest` 的存在？
   - `src/test.ts` 的 `auditMoluoxixiDeps()` 函数执行检查

