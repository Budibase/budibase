import { writable } from "svelte/store"
import api from "../../builderStore/api"

export function createAuthStore() {
  const store = writable({ user: null })

  return {
    subscribe: store.subscribe,
    checkAuth: async () => {
      const response = await api.get("/api/admin/users/self")
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
    updateSelf: async user => {
      const response = await api.post("/api/admin/users/self", user)
      if (response.status === 200) {
        store.update(state => ({ ...state, user: { ...state.user, ...user } }))
      } else {
        throw "Unable to update user details"
      }
    },
    forgotPassword: async email => {
      const response = await api.post(`/api/admin/auth/reset`, {
        email,
      })
      if (response.status !== 200) {
        throw "Unable to send email with reset link"
      }
      await response.json()
    },
    resetPassword: async (password, code) => {
      const response = await api.post(`/api/admin/auth/reset/update`, {
        password,
        resetCode: code,
      })
      if (response.status !== 200) {
        throw "Unable to reset password"
      }
      await response.json()
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
