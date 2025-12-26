/**
 * Husky 安装脚本
 * 在 CI 环境中跳过安装
 */

import process from 'node:process';

if (process.env.CI === 'true') {
  process.exit(0);
}

const husky = (await import('husky')).default;

console.log(husky());

