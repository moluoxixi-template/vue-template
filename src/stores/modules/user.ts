import { defineStore } from 'pinia'
import { ref } from 'vue'
import { verityApp } from '@/api/LoginService'
import { store } from '@/stores'

export const userStore = defineStore(
  'user',
  () => {
    // 定义token
    const token = ref('')

    async function getVerityApp() {
      const res = await verityApp()
      const verityData = res.rows?.[0] || {}
      const { parameterValue } = verityData
      const sessionObj = JSON.parse(parameterValue)
      Object.keys(sessionObj).forEach((key) => {
        sessionStorage.setItem(key, sessionObj[key])
      })
    }

    const userLogin = async () => {
      await getVerityApp()
    }
    const getToken = () => {
      return token.value
    }

    return { getToken, userLogin }
  },
  {
    persist: true,
  },
)

export function useUserStore() {
  return userStore(store)
}
