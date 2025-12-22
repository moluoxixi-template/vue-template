/**
 * JSON 深度合并器
 * 用于合并 package.json, tsconfig.json 等 JSON 文件
 */

import { isArray, isObject, mergeWith } from 'lodash-es'

/**
 * 自定义合并函数
 * 数组采用合并去重策略，对象递归合并
 */
function customMerge(objValue: unknown, srcValue: unknown): unknown {
  // 数组合并去重
  if (isArray(objValue) && isArray(srcValue)) {
    return [...new Set([...objValue, ...srcValue])]
  }
  // 其他情况使用默认合并行为
  return undefined
}

/**
 * 深度合并多个对象
 * @param target 目标对象
 * @param sources 源对象数组
 * @returns 合并后的对象
 */
export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  return mergeWith({}, target, ...sources, customMerge)
}

/**
 * 合并 package.json 文件
 * 特殊处理 dependencies, devDependencies, scripts 等字段
 * @param base 基础 package.json
 * @param patches 补丁 package.json 数组
 * @returns 合并后的 package.json
 */
export function mergePackageJson(
  base: Record<string, unknown>,
  ...patches: Record<string, unknown>[]
): Record<string, unknown> {
  const result = { ...base }

  for (const patch of patches) {
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === null) {
        continue
      }

      // 特殊处理 dependencies 相关字段 - 合并而非覆盖
      if (
        ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].includes(key)
        && isObject(result[key])
        && isObject(value)
      ) {
        result[key] = {
          ...(result[key] as Record<string, string>),
          ...(value as Record<string, string>),
        }
        // 按字母排序
        result[key] = sortObjectKeys(result[key] as Record<string, string>)
      }
      // 特殊处理 scripts - 合并而非覆盖
      else if (key === 'scripts' && isObject(result[key]) && isObject(value)) {
        result[key] = {
          ...(result[key] as Record<string, string>),
          ...(value as Record<string, string>),
        }
      }
      // 其他字段直接覆盖
      else {
        result[key] = value
      }
    }
  }

  return result
}

/**
 * 合并 tsconfig.json 文件
 * @param base 基础 tsconfig
 * @param patches 补丁 tsconfig 数组
 * @returns 合并后的 tsconfig
 */
export function mergeTsConfig(
  base: Record<string, unknown>,
  ...patches: Record<string, unknown>[]
): Record<string, unknown> {
  return deepMerge(base, ...patches)
}

/**
 * 按字母顺序排序对象键
 * @param obj 要排序的对象
 * @returns 排序后的对象
 */
export function sortObjectKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.keys(obj)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = obj[key]
      return sorted
    }, {} as Record<string, T>)
}
