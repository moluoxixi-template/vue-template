import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  token: string
  userInfo: Record<string, unknown>
  setToken: (token: string) => void
  setUserInfo: (info: Record<string, unknown>) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    set => ({
      token: '',
      userInfo: {},
      setToken: (token: string) => set({ token }),
      setUserInfo: (userInfo: Record<string, unknown>) => set({ userInfo }),
      logout: () => set({ token: '', userInfo: {} }),
    }),
    {
      name: 'user-storage',
    },
  ),
)

