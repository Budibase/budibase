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
    attachHeaders: (headers, request) => {
      const isWorkspaceDeleteRequest =
        request?.method === "DELETE" &&
        /^\/api\/applications\/app_dev_/.test(request.url)

      // Attach app ID header from store
      let appId = get(appStore).appId
      if (appId) {
        if (!isWorkspaceDeleteRequest) {
          headers[Header.APP_ID] = opts?.production
            ? sdk.applications.getProdAppID(appId)
            : appId
        }
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

      // On 401 the server has explicitly rejected the credentials.
      // Clear the client session and let the layout redirect to login
      if (status === 401 && get(auth).user) {
        auth.clearSession()
        return
      }

      // Logout on 403's
      if (status === 403) {
        const isAuthenticated = !!get(auth).user
        if (isAuthenticated) {
          // Clear return URL to prevent redirect loops with invalid URLs
          CookieUtils.removeCookie(Constants.Cookies.ReturnUrl)
        }

        // Reload after removing cookie, go to login
        if (
          isAuthenticated &&
          !url.includes("self") &&
          !url.includes("login")
        ) {
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
