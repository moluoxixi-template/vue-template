/**
 * Element Plus Vite 配置扩展
 */

import type { ViteConfigExtension } from '../../../src/types'

const config: ViteConfigExtension = {
  imports: [],
  plugins: [],
  config: {
    css: {
      preprocessorOptions: {
        scss: {
          // Element Plus 主题定制
          additionalData: `(source, filename) => {
            if (filename.includes('assets/styles/element/index.scss')) {
              return \`$namespace: '\${appCode || 'el'}';\\n\${source}\`
            }
            return source
          }`,
        },
      },
    },
  },
}

export default config
