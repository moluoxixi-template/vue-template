# Vite CLI Next - 原子化分层叠加架构

基于原子化分层叠加架构的 Vue/React 项目脚手架，对标 create-vue。

## 核心架构

### 模板分层结构

```
templates/
├─ base/                    # L0：跨框架通用
│  ├─ .gitignore
│  ├─ .npmrc
│  ├─ .cz-config.cjs
│  ├─ commitlint.config.ts
│  ├─ .env*
│  ├─ .husky/
│  ├─ scripts/
│  └─ src/
│     ├─ apis/              # API 服务
│     ├─ assets/            # 静态资源
│     ├─ constants/         # 常量定义
│     ├─ locales/           # 语言包
│     └─ utils/             # 工具函数
│
├─ vue/
│  ├─ base/                 # L1：Vue 母版
│  │  ├─ vite.config.ts.ejs
│  │  ├─ main.ts.ejs
│  │  ├─ eslint.config.ts
│  │  ├─ tsconfig*.json
│  │  ├─ package.json.data.ts
│  │  ├─ pnpm-workspace.data.ts
│  │  └─ src/
│  │     ├─ router/
│  │     ├─ stores/
│  │     ├─ layouts/
│  │     ├─ directives/
│  │     ├─ components/
│  │     └─ pages/
│  │
│  └─ features/             # L2：Vue 原子特性
│     ├─ sentry/
│     │  └─ vite.config.data.ts
│     └─ pageRoutes/
│        └─ vite.config.data.ts
│
└─ react/
   ├─ base/                 # L1：React 母版
   └─ features/             # L2：React 原子特性
```

### 渲染扫描顺序

**L0 → L1 → L2**，遵循"后覆盖前"原则：

1. **L0 (base/)**: 跨框架通用文件，直接复制
2. **L1 (vue/base/ 或 react/base/)**: 框架母版模板，覆盖 L0
3. **L2 (features/)**: 原子特性，根据配置选择性叠加

### 特殊文件处理

| 文件 | 处理方式 |
|------|---------|
| `package.json` | 深度合并（禁用 EJS） |
| `pnpm-workspace.yaml` | 数据驱动生成 |
| `vite.config.ts` | EJS 模板 + 数据注入 |
| `main.ts` | EJS 模板（插槽化） |
| 其他文件 | 物理覆盖或累加 |

## 强制依赖约束

所有生成的项目必须包含以下 `@moluoxixi` 依赖：

| 包名 | 版本 | 说明 |
|------|------|------|
| `@moluoxixi/eslint-config` | `latest` | ESLint 配置 |
| `@moluoxixi/vite-config` | `latest` | Vite 配置 |
| `@moluoxixi/ajax-package` | `latest` | 网络请求 |
| `@moluoxixi/class-names` | `latest` | 类名工具 |
| `@moluoxixi/css-module-global-root-plugin` | `latest` | CSS 插件 |

## vite.config.data.ts 接口

L2 特性的 `vite.config.data.ts` 导出格式：

```typescript
import type { ViteConfigDataType } from '../../../src/types';

export function getFeatureViteConfig(): ViteConfigDataType {
  return {
    imports: [['identifier', 'modulePath']],  // 导入语句
    plugins: ['pluginFactory(options)'],       // 插件配置
    config: { /* 部分 Vite 配置 */ },
  };
}
```

## main.ts.ejs 逻辑块设计

插件顺序规范：

1. `createApp` - 创建应用
2. `directives` - 全局指令
3. `router` - 路由
4. `store` - 状态管理
5. `i18n` - 国际化（可选）
6. `sentry` - 错误监控（可选）
7. `app.mount` - 挂载

## CLI 使用

```bash
# 安装
pnpm add -g @moluoxixi/create-app

# 创建项目
create-mox create my-project

# 或直接运行
create-mox my-project
```

### 交互选项

| 选项 | 说明 |
|------|------|
| 项目名称 | 项目文件夹名称 |
| 框架 | Vue 3 / React |
| UI 组件库 | Element Plus / Ant Design Vue / Ant Design |
| 路由模式 | 文件系统路由 / 手动配置 |
| 国际化 | 是否启用 vue-i18n / react-i18next |
| 微前端 | 是否启用 qiankun |
| 错误监控 | 是否启用 Sentry |
| 包管理器 | pnpm / npm / yarn |

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 运行测试
pnpm test

# 构建
pnpm build
```

## 测试矩阵

| 配置 | 框架 | UI 库 | 路由 | i18n | qiankun | sentry |
|------|------|-------|------|------|---------|--------|
| vue-element-basic | Vue | Element Plus | 手动 | ✓ | ✗ | ✗ |
| vue-element-full | Vue | Element Plus | 文件系统 | ✓ | ✓ | ✓ |
| vue-antd-basic | Vue | Ant Design Vue | 手动 | ✓ | ✗ | ✗ |

## 验收标准

1. ✅ 所有生成产物包含 `@moluoxixi/eslint-config@latest`
2. ✅ 所有生成产物包含 `@moluoxixi/vite-config@latest`
3. ✅ 所有生成产物包含 `@moluoxixi/ajax-package@latest`
4. ✅ `vite.config.ts` 遵循数据化规范
5. ✅ `main.ts` 遵循中心化规范
6. ✅ CLI 使用体验与 create-vue 保持一致

## License

MIT

