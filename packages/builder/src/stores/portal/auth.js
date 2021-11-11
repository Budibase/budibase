import { derived, writable, get } from "svelte/store"
import api from "../../builderStore/api"
import { admin } from "stores/portal"
import analytics from "analytics"

export function createAuthStore() {
  const auth = writable({
    user: null,
    tenantId: "default",
    tenantSet: false,
    loaded: false,
  })
  const store = derived(auth, $store => {
    let initials = null
    let isAdmin = false
    let isBuilder = false
    if ($store.user) {
      const user = $store.user
      if (user.firstName) {
        initials = user.firstName[0]
        if (user.lastName) {
          initials += user.lastName[0]
        }
      } else if (user.email) {
        initials = user.email[0]
      } else {
        initials = "Unknown"
      }
      isAdmin = !!user.admin?.global
      isBuilder = !!user.builder?.global
    }
    return {
      user: $store.user,
      tenantId: $store.tenantId,
      tenantSet: $store.tenantSet,
      loaded: $store.loaded,
      initials,
      isAdmin,
      isBuilder,
    }
  })

  function setUser(user) {
    auth.update(store => {
      store.loaded = true
      store.user = user
      if (user) {
        store.tenantId = user.tenantId || "default"
        store.tenantSet = true
      }
      return store
    })

    if (user) {
      analytics.activate().then(() => {
        analytics.identify(user._id, user)
        analytics.showChat({
          email: user.email,
          created_at: (user.createdAt || Date.now()) / 1000,
          name: user.account?.name,
          user_id: user._id,
          tenant: user.tenantId,
          "Company size": user.account?.size,
          "Job role": user.account?.profession,
        })
      })
    }
  }

  async function setOrganisation(tenantId) {
    const prevId = get(store).tenantId
    auth.update(store => {
      store.tenantId = tenantId
      store.tenantSet = !!tenantId
      return store
    })
    if (prevId !== tenantId) {
      // re-init admin after setting org
      await admin.init()
    }
  }

  async function setInitInfo(info) {
    await api.post(`/api/global/auth/init`, info)
    auth.update(store => {
      store.initInfo = info
      return store
    })
    return info
  }

  async function getInitInfo() {
    const response = await api.get(`/api/global/auth/init`)
    const json = response.json()
    auth.update(store => {
      store.initInfo = json
      return store
    })
    return json
  }

  return {
    subscribe: store.subscribe,
    setOrganisation,
    getInitInfo,
    setInitInfo,
    checkQueryString: async () => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has("tenantId")) {
        const tenantId = urlParams.get("tenantId")
        await setOrganisation(tenantId)
      }
    },
    setOrg: async tenantId => {
      await setOrganisation(tenantId)
    },
    checkAuth: async () => {
      const response = await api.get("/api/global/users/self")
      if (response.status !== 200) {
        setUser(null)
      } else {
        const json = await response.json()
        setUser(json)
      }
    },
    login: async creds => {
      const tenantId = get(store).tenantId
      const response = await api.post(
        `/api/global/auth/${tenantId}/login`,
        creds
      )
      const json = await response.json()
      if (response.status === 200) {
        setUser(json.user)
      } else {
        throw new Error(json.message ? json.message : "Invalid credentials")
      }
      return json
    },
    logout: async () => {
      const response = await api.post(`/api/global/auth/logout`)
      if (response.status !== 200) {
        throw "Unable to create logout"
      }
      await response.json()
      await setInitInfo({})
      setUser(null)
    },
    updateSelf: async fields => {
      const newUser = { ...get(auth).user, ...fields }
      const response = await api.post("/api/global/users/self", newUser)
      if (response.status === 200) {
        setUser(newUser)
      } else {
        throw "Unable to update user details"
      }
    },
    forgotPassword: async email => {
      const tenantId = get(store).tenantId
      const response = await api.post(`/api/global/auth/${tenantId}/reset`, {
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
        `/api/global/auth/${tenantId}/reset/update`,
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
      const response = await api.post(`/api/global/users`, user)
      if (response.status !== 200) {
        throw "Unable to create user"
      }
      await response.json()
    },
  }
}

export const auth = createAuthStore()
