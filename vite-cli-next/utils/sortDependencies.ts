/**
 * 排序 package.json 中的依赖
 * 参考 create-vue 实现
 */

export default function sortDependencies(
  packageJson: Record<string, unknown>,
): Record<string, unknown> {
  const sorted: Record<string, unknown> = {}

  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

  for (const key of Object.keys(packageJson)) {
    if (depTypes.includes(key)) {
      sorted[key] = sortObject(packageJson[key] as Record<string, string>)
    }
    else {
      sorted[key] = packageJson[key]
    }
  }

  return sorted
}

function sortObject(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key]
      return result
    }, {} as Record<string, string>)
}
