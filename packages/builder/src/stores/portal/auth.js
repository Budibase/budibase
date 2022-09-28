import { derived, writable, get } from "svelte/store"
import { API } from "api"
import { admin } from "stores/portal"
import analytics from "analytics"

export function createAuthStore() {
  const auth = writable({
    user: null,
    accountPortalAccess: false,
    tenantId: "default",
    tenantSet: false,
    loaded: false,
    postLogout: false,
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
      accountPortalAccess: $store.accountPortalAccess,
      tenantId: $store.tenantId,
      tenantSet: $store.tenantSet,
      loaded: $store.loaded,
      postLogout: $store.postLogout,
      initials,
      isAdmin,
      isBuilder,
    }
  })

  function setUser(user) {
    auth.update(store => {
      store.loaded = true
      store.user = user
      store.accountPortalAccess = user?.accountPortalAccess
      if (user) {
        store.tenantId = user.tenantId || "default"
        store.tenantSet = true
      }
      return store
    })

    if (user) {
      analytics
        .activate()
        .then(() => {
          analytics.identify(user._id)
          analytics.showChat(
            {
              email: user.email,
              created_at: (user.createdAt || Date.now()) / 1000,
              name: user.account?.name,
              user_id: user._id,
              tenant: user.tenantId,
              admin: user?.admin?.global,
              builder: user?.builder?.global,
              "Company size": user.account?.size,
              "Job role": user.account?.profession,
            },
            !!user?.account
          )
        })
        .catch(() => {
          // This request may fail due to browser extensions blocking requests
          // containing the word analytics, so we don't want to spam users with
          // an error here.
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
    await API.setInitInfo(info)
    auth.update(store => {
      store.initInfo = info
      return store
    })
    return info
  }

  function setPostLogout() {
    auth.update(store => {
      store.postLogout = true
      return store
    })
  }

  async function getInitInfo() {
    const info = await API.getInitInfo()
    auth.update(store => {
      store.initInfo = info
      return store
    })
    return info
  }

  const actions = {
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
    getSelf: async () => {
      // We need to catch this locally as we never want this to fail, even
      // though normally we never want to swallow API errors at the store level.
      // We're either logged in or we aren't.
      // We also need to always update the loaded flag.
      try {
        const user = await API.fetchBuilderSelf()
        setUser(user)
      } catch (error) {
        setUser(null)
      }
    },
    login: async creds => {
      const tenantId = get(store).tenantId
      await API.logIn({
        username: creds.username,
        password: creds.password,
        tenantId,
      })
      await actions.getSelf()
    },
    logout: async () => {
      setUser(null)
      setPostLogout()
      await API.logOut()
      await setInitInfo({})
    },
    updateSelf: async fields => {
      const newUser = { ...get(auth).user, ...fields }
      await API.updateSelf(newUser)
      setUser(newUser)
    },
    forgotPassword: async email => {
      const tenantId = get(store).tenantId
      await API.requestForgotPassword({
        tenantId,
        email,
      })
    },
    resetPassword: async (password, resetCode) => {
      const tenantId = get(store).tenantId
      await API.resetPassword({
        tenantId,
        password,
        resetCode,
      })
    },
    generateAPIKey: async () => {
      return API.generateAPIKey()
    },
    fetchAPIKey: async () => {
      const info = await API.fetchDeveloperInfo()
      return info?.apiKey
    },
  }

  return {
    subscribe: store.subscribe,
    setOrganisation,
    getInitInfo,
    setInitInfo,
    ...actions,
  }
}

export const auth = createAuthStore()
