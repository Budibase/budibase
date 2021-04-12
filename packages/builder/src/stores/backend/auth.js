import { writable, get } from "svelte/store"
import api from "../../builderStore/api"

export function createAuthStore() {
  const { subscribe, set } = writable({})

  const user = localStorage.getItem("auth:user")
  if (user) set({ user: JSON.parse(user) })

  return {
    subscribe,
    login: async creds => {
      const response = await api.post(`/api/admin/auth`, creds)
      const json = await response.json()
      if (json.user) {
        localStorage.setItem("auth:user", JSON.stringify(json.user))
        set({ user: json.user })
      }
    },
    logout: async () => {
      const response = await api.post(`/api/auth/logout`)
      const json = await response.json()
      set({ user: false })
    },
    createUser: async user => {
      const response = await api.post(`/api/admin/users`, user)
      const json = await response.json()
    },
  }
}

export const auth = createAuthStore()
