/**
 * Sentry main.ts 扩展
 */

import type { MainTsExtension } from '../../../src/types'

const config: MainTsExtension = {
  imports: ['import { initSentry } from \'@/utils/sentry\''],
  afterRouter: ['initSentry(app, router)'],
}

export default config
