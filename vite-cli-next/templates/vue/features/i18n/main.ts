/**
 * i18n main.ts 扩展
 */

import type { MainTsExtension } from '../../../src/types'

const config: MainTsExtension = {
  imports: ['import i18n from \'@/locales\''],
  appUse: ['app.use(i18n)'],
}

export default config
