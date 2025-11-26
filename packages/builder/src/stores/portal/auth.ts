import { get } from "svelte/store"
import { API } from "@/api"
import { admin } from "./admin"
import analytics from "@/analytics"
import { BudiStore } from "@/stores/BudiStore"
import { reset as resetBuilderStores } from "@/stores/builder"
import { CookieUtils, Constants } from "@budibase/frontend-core"
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

  setUser(user?: GetGlobalSelfResponse, sessionTerminated = false) {
    this.set({
      loaded: true,
      user: user,
      accountPortalAccess: !!user?.accountPortalAccess,
      tenantId: user?.tenantId || "default",
      tenantSet: !!user,
      isSSO: user != null && isSSOUser(user),
      postLogout: sessionTerminated,
    })

    if (user) {
      analytics
        .activate()
        .then(() => {
          analytics.identify(user._id!)
        })
        .catch(() => {
          // This request may fail due to browser extensions blocking requests
          // containing the word analytics, so we don't want to spam users with
          // an error here.
        })
    }
  }

  clearSession() {
    // sessionTerminated true prevents saving return URL for invalid URLs
    this.setUser(undefined, true)
  }

  async setOrganisation(tenantId = "default") {
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

  async login(username: string, password: string, targetTenantId?: string) {
    const tenantId = targetTenantId || get(this.store).tenantId
    const loginResult = await API.logIn(tenantId, username, password)

    await this.getSelf()

    return {
      invalidatedSessionCount: loginResult.invalidatedSessionCount || 0,
    }
  }

  async logout() {
    // Save current URL as return URL before logging out, unless we're on pre-login pages
    const currentPath = window.location.pathname
    const isPreLoginPage =
      currentPath.startsWith("/builder/auth") ||
      currentPath.startsWith("/builder/invite") ||
      currentPath.startsWith("/builder/admin")

    if (
      !isPreLoginPage &&
      !CookieUtils.getCookie(Constants.Cookies.ReturnUrl)
    ) {
      CookieUtils.setCookie(Constants.Cookies.ReturnUrl, currentPath)
    }

    await API.logOut()
    this.setPostLogout()
    this.setUser()
    try {
      await this.setInitInfo({})
    } catch (error) {
      // Ignore errors clearing init info after logout
      // User is already logged out, this is just cleanup
    }
    // App info needs to be cleared on logout.
    // Invalid app context will cause init failures for users logging back in.
    resetBuilderStores()
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

  /**
   * Determine the tenantId and set it
   * This is required for checklist requests on load or logout.
   * If it can't be determined, "default" is used.
   */
  async validateTenantId() {
    const store = get(this.store)
    const adminStore = get(admin)
    const host = window.location.host
    if (host.includes("localhost:") || !adminStore.baseUrl) {
      // ignore local dev
      return
    }
    const mainHost = new URL(adminStore.baseUrl).host
    let urlTenantId
    // remove the main host part
    const hostParts = host.split(mainHost).filter(part => part !== "")
    // if there is a part left, it has to be the tenant ID subdomain
    if (hostParts.length === 1) {
      urlTenantId = hostParts[0].replace(/\./g, "")
    }

    if (store.user && store.user?.tenantId) {
      if (!urlTenantId) {
        // redirect to correct tenantId subdomain
        if (!window.location.host.includes("localhost")) {
          let redirectUrl = window.location.href
          redirectUrl = redirectUrl.replace("://", `://${store.user.tenantId}.`)
          window.location.href = redirectUrl
        }
        return
      }

      if (urlTenantId && store.user.tenantId !== urlTenantId) {
        // user should not be here - play it safe and log them out
        try {
          await this.logout()
          await this.setOrganisation()
        } catch (error) {
          console.error(
            `Tenant mis-match - "${urlTenantId}" and "${store.user.tenantId}" - logout`
          )
        }
      }
    } else {
      // no user - set the org according to the url
      await this.setOrganisation(urlTenantId)
    }
  }
}

export const auth = new AuthStore()
