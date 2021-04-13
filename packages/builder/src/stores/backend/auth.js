import { writable, get } from "svelte/store"
import api from "../../builderStore/api"

async function checkAuth() {
  const response = await api.get("/api/self")
  const user = await response.json()
  if (response.status === 200) return user

  return null
}

export function createAuthStore() {
  const { subscribe, set } = writable({})

  checkAuth()
    .then(user => set({ user }))
    .catch(err => set({ user: null }))

  return {
    subscribe,
    login: async creds => {
      const response = await api.post(`/api/admin/auth`, creds)
      const json = await response.json()
      if (json.user) {
        localStorage.setItem("auth:user", JSON.stringify(json.user))
        set({ user: json.user })
      }
      return json
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
