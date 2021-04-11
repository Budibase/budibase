import { writable, get } from "svelte/store"
import api from "../../builderStore/api"

export function createAuthStore() {
  const { subscribe } = writable({})

  return {
    subscribe,
    login: async () => {
      const response = await api.post(`/api/admin/auth/authenticate`)
      const json = await response.json()
      set({ user: json })
    },
    logout: async () => {
      const response = await api.post(`/api/auth/logout`)
      const json = await response.json()
      set({ user: null })
    },
  }
}

export const auth = createAuthStore()
