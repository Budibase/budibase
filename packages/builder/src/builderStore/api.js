import {
  createAPIClient,
  CookieUtils,
  Constants,
} from "@budibase/frontend-core"
import { store } from "./index"
import { get } from "svelte/store"
import { notifications } from "@budibase/bbui"

export const API = createAPIClient({
  attachHeaders: headers => {
    // Attach app ID header from store
    headers["x-budibase-app-id"] = get(store).appId
  },

  onError: error => {
    const { url, message, status } = error

    // Log all API errors to Sentry
    // analytics.captureException(error)

    // Show a notification for any errors
    if (message) {
      notifications.error(`Error fetching ${url}: ${message}`)
    }

    // Logout on 403's
    if (status === 403) {
      // Don't do anything if fetching templates.
      // TODO: clarify why this is here
      if (url.includes("/api/templates")) {
        return
      }

      // Remove the auth cookie
      CookieUtils.removeCookie(Constants.Cookies.Auth)

      // Reload after removing cookie, go to login
      if (!url.includes("self") && !url.includes("login")) {
        location.reload()
      }
    }
  },
})
