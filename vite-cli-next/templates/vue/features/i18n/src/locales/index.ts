import { createI18n } from 'vue-i18n'
import en from './lang/en.json'
import zh from './lang/zh-CN.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en': en,
  },
})

export default i18n

