import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref<Record<string, unknown>>({})

    function setToken(value: string) {
      token.value = value
    }

    function setUserInfo(value: Record<string, unknown>) {
      userInfo.value = value
    }

    function logout() {
      token.value = ''
      userInfo.value = {}
    }

    return {
      token,
      userInfo,
      setToken,
      setUserInfo,
      logout,
    }
  },
  {
    persist: true,
  },
)

