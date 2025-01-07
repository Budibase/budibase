import { get } from "svelte/store"
import { API } from "@/api"
import { admin } from "@/stores/portal"
import analytics from "@/analytics"
import { BudiStore } from "@/stores/BudiStore"
import {
  GetGlobalSelfResponse,
  isSSOUser,
  SetInitInfoRequest,
  UpdateSelfRequest,
} from "@budibase/types"

interface PortalAuthStore {
  user?: GetGlobalSelfResponse
  initInfo?: Record<string, any>
  accountPortalAccess: boolean
  loaded: boolean
  isSSO: boolean
  tenantId: string
  tenantSet: boolean
  postLogout: boolean
}

class AuthStore extends BudiStore<PortalAuthStore> {
  constructor() {
    super({
      accountPortalAccess: false,
      tenantId: "default",
      tenantSet: false,
      loaded: false,
      postLogout: false,
      isSSO: false,
    })
  }

  setUser(user?: GetGlobalSelfResponse) {
    this.set({
      loaded: true,
      user: user,
      accountPortalAccess: !!user?.accountPortalAccess,
      tenantId: user?.tenantId || "default",
      tenantSet: !!user,
      isSSO: user != null && isSSOUser(user),
      postLogout: false,
    })

    if (user) {
      analytics
        .activate()
        .then(() => {
          analytics.identify(user._id)
        })
        .catch(() => {
          // This request may fail due to browser extensions blocking requests
          // containing the word analytics, so we don't want to spam users with
          // an error here.
        })
    }
  }

  async setOrganisation(tenantId: string) {
    const prevId = get(this.store).tenantId
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

  async setInitInfo(info: SetInitInfoRequest) {
    await API.setInitInfo(info)
    auth.update(store => {
      store.initInfo = info
      return store
    })
    return info
  }

  setPostLogout() {
    auth.update(store => {
      store.postLogout = true
      return store
    })
  }

  async getInitInfo() {
    const info = await API.getInitInfo()
    auth.update(store => {
      store.initInfo = info
      return store
    })
    return info
  }

  async checkQueryString() {
    const urlParams = new URLSearchParams(window.location.search)
    const tenantId = urlParams.get("tenantId")
    if (tenantId) {
      await this.setOrganisation(tenantId)
    }
  }

  async setOrg(tenantId: string) {
    await this.setOrganisation(tenantId)
  }

  async getSelf() {
    // We need to catch this locally as we never want this to fail, even
    // though normally we never want to swallow API errors at the store level.
    // We're either logged in or we aren't.
    // We also need to always update the loaded flag.
    try {
      const user = await API.fetchBuilderSelf()
      this.setUser(user)
    } catch (error) {
      this.setUser()
    }
  }

  async login(username: string, password: string) {
    const tenantId = get(this.store).tenantId
    await API.logIn(tenantId, username, password)
    await this.getSelf()
  }

  async logout() {
    await API.logOut()
    this.setPostLogout()
    this.setUser()
    await this.setInitInfo({})
  }

  async updateSelf(fields: UpdateSelfRequest) {
    await API.updateSelf(fields)
    // Refetch to enrich after update.
    try {
      const user = await API.fetchBuilderSelf()
      this.setUser(user)
    } catch (error) {
      this.setUser()
    }
  }

  async forgotPassword(email: string) {
    const tenantId = get(this.store).tenantId
    await API.requestForgotPassword(tenantId, email)
  }

  async resetPassword(password: string, resetCode: string) {
    const tenantId = get(this.store).tenantId
    await API.resetPassword(tenantId, password, resetCode)
  }

  async generateAPIKey() {
    return API.generateAPIKey()
  }

  async fetchAPIKey() {
    const info = await API.fetchDeveloperInfo()
    return info?.apiKey
  }
}

export const auth = new AuthStore()
