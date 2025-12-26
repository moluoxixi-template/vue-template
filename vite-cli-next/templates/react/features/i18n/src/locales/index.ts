import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './lang/en.json'
import zh from './lang/zh-CN.json'

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zh },
    'en': { translation: en },
  },
  lng: localStorage.getItem('locale') || 'zh-CN',
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

