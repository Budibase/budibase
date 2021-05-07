import { writable } from "svelte/store"
import api from "../../builderStore/api"

export function createAuthStore() {
  const store = writable({ user: null })

  return {
    subscribe: store.subscribe,
    checkAuth: async () => {
      const response = await api.get("/api/self")
      const user = await response.json()
      if (response.status === 200) {
        store.update(state => ({ ...state, user }))
      } else {
        store.update(state => ({ ...state, user: null }))
      }
    },
    login: async creds => {
      const response = await api.post(`/api/admin/auth`, creds)
      const json = await response.json()
      if (response.status === 200) {
        store.update(state => ({ ...state, user: json.user }))
      } else {
        throw "Invalid credentials"
      }
      return json
    },
    logout: async () => {
      const response = await api.post(`/api/admin/auth/logout`)
      if (response.status !== 200) {
        throw "Unable to create logout"
      }
      await response.json()
      store.update(state => ({ ...state, user: null }))
    },
    createUser: async user => {
      const response = await api.post(`/api/admin/users`, user)
      if (response.status !== 200) {
        throw "Unable to create user"
      }
      await response.json()
    },
  }
}

export const auth = createAuthStore()
