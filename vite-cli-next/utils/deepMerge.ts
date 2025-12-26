/**
 * 深度合并工具
 * 参考 create-vue 实现
 */

function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

/**
 * 深度合并两个对象
 * 数组采用追加模式（去重）
 * 对象递归合并
 */
export default function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...target }

  for (const key of Object.keys(source)) {
    const targetValue = result[key]
    const sourceValue = source[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      // 数组合并去重
      result[key] = [...new Set([...targetValue, ...sourceValue])]
    }
    else if (isObject(targetValue) && isObject(sourceValue)) {
      // 对象递归合并
      result[key] = deepMerge(targetValue, sourceValue)
    }
    else {
      // 直接覆盖
      result[key] = sourceValue
    }
  }

  return result
}
