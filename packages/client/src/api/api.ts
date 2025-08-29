import { createAPIClient } from "@budibase/frontend-core"
import { authStore } from "../stores/auth"
import {
  notificationStore,
  devToolsEnabled,
  devToolsStore,
  recaptchaStore,
  appStore,
} from "../stores"
import { get } from "svelte/store"

export const API = createAPIClient({
  // Enable caching of cacheable endpoints to speed things up,
  enableCaching: true,

  // Attach client specific headers
  attachHeaders: headers => {
    // Attach app ID header
    if (window["##BUDIBASE_APP_ID##"]) {
      headers["x-budibase-app-id"] = window["##BUDIBASE_APP_ID##"]
    }

    // Attach the iframe location pathname to ensure the app url is fully preserved.
    // Needed for workspace app resolution and client routing in an embed
    const appData = get(appStore)
    if (appData.embedded) {
      headers["x-budibase-embed-location"] = window.location.pathname
    }

    // Attach client header if not inside the builder preview
    if (!window["##BUDIBASE_IN_BUILDER##"]) {
      headers["x-budibase-type"] = "client"
    }

    // Add csrf token if authenticated
    const auth = get(authStore)
    if (auth?.csrfToken) {
      headers["x-csrf-token"] = auth.csrfToken
    }

    // Add role header
    const $devToolsStore = get(devToolsStore)
    const $devToolsEnabled = get(devToolsEnabled)
    if ($devToolsEnabled && $devToolsStore.role) {
      headers["x-budibase-role"] = $devToolsStore.role
    }
  },

  // Show an error notification for all API failures.
  // We could also log these to Posthog.
  // Or we could check error.status and redirect to login on a 403 etc.
  onError: error => {
    const { status, method, url, message, handled, suppressErrors } =
      error || {}
    const ignoreErrorUrls = [
      "bbtel",
      "/api/global/self",
      "/api/tables/ta_users",
    ]

    // expired token, this means the recaptcha token has expired, need to re-assert
    if (status === 498) {
      recaptchaStore.actions.unverified()
      return
    }

    // Log any errors that we haven't manually handled
    if (!handled) {
      console.error("Unhandled error from API client", error)
      return
    }

    // Notify all errors
    if (message && !suppressErrors) {
      // Don't notify if the URL contains the word analytics as it may be
      // blocked by browser extensions
      let ignore = false
      for (let ignoreUrl of ignoreErrorUrls) {
        if (url?.includes(ignoreUrl)) {
          ignore = true
          break
        }
      }
      if (!ignore) {
        const validationErrors = error?.json?.validationErrors
        if (validationErrors) {
          for (let field in validationErrors) {
            notificationStore.actions.error(
              `${field} ${validationErrors[field]}`
            )
          }
        } else {
          notificationStore.actions.error(message)
        }
      }
    }

    // Log all errors to console
    console.warn(`[Client] HTTP ${status} on ${method}:${url}\n\t${message}`)
  },
  onMigrationDetected: _appId => {
    if (!window.MIGRATING_APP) {
      // We will force a reload, that will display the updating screen until the migration is running
      window.location.reload()
    }
  },
})
