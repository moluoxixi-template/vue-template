import { BaseApi } from '@moluoxixi/ajax-package'

const roleService = new BaseApi({
  baseURL: '/ts-system',
})
console.log('roleService', roleService)
const roleRequest = roleService.instance
export function verityApp() {
  return roleRequest.get('/api/sys/parameter/list', {
    params: {
      sord: 'desc',
      pageNo: 1,
      pageSize: 100,
      condition: 'HIS6_AUTH_CONFIG',
    },
  })
}
