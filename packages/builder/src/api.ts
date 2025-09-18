import {
  Constants,
  CookieUtils,
  createAPIClient,
} from "@budibase/frontend-core"
import { appStore } from "@/stores/builder"
import { get } from "svelte/store"
import { auth, navigation } from "./stores/portal"
import { sdk, Header, ClientHeader } from "@budibase/shared-core"

const newClient = (opts?: { production?: boolean }) =>
  createAPIClient({
    attachHeaders: headers => {
      // Attach app ID header from store
      let appId = get(appStore).appId
      if (appId) {
        headers[Header.APP_ID] = opts?.production
          ? sdk.applications.getProdAppID(appId)
          : appId
        headers[Header.CLIENT] = ClientHeader.BUILDER
      }

      // Add csrf token if authenticated
      const user: any = get(auth).user
      if (user?.csrfToken) {
        headers["x-csrf-token"] = user.csrfToken
      }
    },

    onError: error => {
      const { url, message, status, method, handled } = error || {}

      // Log any errors that we haven't manually handled
      if (!handled) {
        console.error("Unhandled error from API client", error)
        return
      }

      // Log all errors to console
      console.warn(`[Builder] HTTP ${status} on ${method}:${url}\n\t${message}`)

      // Logout on 403's
      if (status === 403) {
        // Remove cookies
        CookieUtils.removeCookie(Constants.Cookies.Auth)

        // Reload after removing cookie, go to login
        if (!url.includes("self") && !url.includes("login")) {
          location.reload()
        }
      }
    },
    onMigrationDetected: appId => {
      const updatingUrl = `/builder/workspace/updating/${appId}`

      if (window.location.pathname === updatingUrl) {
        return
      }

      get(navigation)?.goto(
        `${updatingUrl}?returnUrl=${encodeURIComponent(window.location.pathname)}`
      )
    },
  })

export const API = newClient()
export const productionAPI = newClient({ production: true })
