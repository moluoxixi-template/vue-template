/**
 * JSON 深度合并器
 * 用于合并 package.json, tsconfig.json 等 JSON 文件
 */

import { isArray, isObject, mergeWith } from 'lodash-es'

function customMerge(objValue: unknown, srcValue: unknown): unknown {
  if (isArray(objValue) && isArray(srcValue)) {
    return [...new Set([...objValue, ...srcValue])]
  }
  return undefined
}

export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  return mergeWith({}, target, ...sources, customMerge)
}

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

      if (
        ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].includes(key)
        && isObject(result[key])
        && isObject(value)
      ) {
        result[key] = {
          ...(result[key] as Record<string, string>),
          ...(value as Record<string, string>),
        }
        result[key] = sortObjectKeys(result[key] as Record<string, string>)
      }
      else if (key === 'scripts' && isObject(result[key]) && isObject(value)) {
        result[key] = {
          ...(result[key] as Record<string, string>),
          ...(value as Record<string, string>),
        }
      }
      else {
        result[key] = value
      }
    }
  }

  return result
}

export function mergeTsConfig(
  base: Record<string, unknown>,
  ...patches: Record<string, unknown>[]
): Record<string, unknown> {
  return deepMerge(base, ...patches)
}

export function sortObjectKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.keys(obj)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = obj[key]
      return sorted
    }, {} as Record<string, T>)
}
