/**
 * 国际化配置
 * 使用 vue-i18n 进行多语言支持
 */

import { createI18n } from 'vue-i18n'
import en from './lang/en'
import es from './lang/es'
import zh from './lang/zh'

const messages = {
  zh,
  en,
  es,
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
})

export default i18n
