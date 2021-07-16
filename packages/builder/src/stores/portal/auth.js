import { derived, writable, get } from "svelte/store"
import api from "../../builderStore/api"

export function createAuthStore() {
  const user = writable(null)
  const store = derived(user, $user => {
    let initials = null
    let isAdmin = false
    let isBuilder = false
    let tenantId = "default"
    if ($user) {
      if ($user.firstName) {
        initials = $user.firstName[0]
        if ($user.lastName) {
          initials += $user.lastName[0]
        }
      } else if ($user.email) {
        initials = $user.email[0]
      } else {
        initials = "Unknown"
      }
      isAdmin = !!$user.admin?.global
      isBuilder = !!$user.builder?.global
      tenantId = $user.tenantId || tenantId
    }
    return {
      user: $user,
      initials,
      isAdmin,
      isBuilder,
      tenantId,
    }
  })

  return {
    subscribe: store.subscribe,
    checkAuth: async () => {
      const response = await api.get("/api/admin/users/self")
      if (response.status !== 200) {
        user.set(null)
      } else {
        const json = await response.json()
        user.set(json)
      }
    },
    login: async creds => {
      const tenantId = creds.tenantId || get(store).tenantId
      delete creds.tenantId
      const response = await api.post(
        `/api/admin/auth/${tenantId}/login`,
        creds
      )
      const json = await response.json()
      if (response.status === 200) {
        user.set(json.user)
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
      user.set(null)
    },
    updateSelf: async fields => {
      const newUser = { ...get(user), ...fields }
      const response = await api.post("/api/admin/users/self", newUser)
      if (response.status === 200) {
        user.set(newUser)
      } else {
        throw "Unable to update user details"
      }
    },
    forgotPassword: async email => {
      const tenantId = get(store).tenantId
      const response = await api.post(`/api/admin/auth/${tenantId}/reset`, {
        email,
      })
      if (response.status !== 200) {
        throw "Unable to send email with reset link"
      }
      await response.json()
    },
    resetPassword: async (password, code) => {
      const tenantId = get(store).tenantId
      const response = await api.post(
        `/api/admin/auth/${tenantId}/reset/update`,
        {
          password,
          resetCode: code,
        }
      )
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
