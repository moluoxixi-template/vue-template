/**
 * 国际化配置
 * i18next 配置
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './lang/en'
import es from './lang/es'
import zh from './lang/zh'

const resources = {
  zh: { translation: zh },
  en: { translation: en },
  es: { translation: es },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'zh',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
