import { writable } from "svelte/store"
import api from "../../builderStore/api"

async function checkAuth() {
  const response = await api.get("/api/self")
  const user = await response.json()
  if (response.status === 200) return user

  return null
}

export function createAuthStore() {
  const { subscribe, set } = writable(null)

  checkAuth()
    .then(user => set({ user }))
    .catch(() => set({ user: null }))

  return {
    subscribe,
    login: async creds => {
      const response = await api.post(`/api/admin/auth`, creds)
      const json = await response.json()
      if (response.status === 200) {
        set({ user: json.user })
      } else {
        throw "Invalid credentials"
      }
      return json
    },
    logout: async () => {
      const response = await api.post(`/api/admin/auth/logout`)
      await response.json()
      set({ user: null })
    },
    createUser: async user => {
      const response = await api.post(`/api/admin/users`, user)
      await response.json()
    },
  }
}

export const auth = createAuthStore()
