/**
 * 文件系统路由特性 - Vite 配置数据
 */

import type { ViteConfigDataType } from '../../../src/types';

/**
 * 获取文件系统路由 Vite 配置
 */
export function getPageRoutesViteConfig(): ViteConfigDataType {
  return {
    imports: [],
    plugins: [],
    config: {
      pageRoutes: true,
    },
  };
}

