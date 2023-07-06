import { derived } from "svelte/store"
import { params } from "@roxi/routify"
import { integrations } from "stores/backend"
import { IntegrationTypes } from "constants/backend"

export const createOnGoogleAuthStore = () => {
  return derived([params, integrations], ([$params, $integrations]) => {
    const id = $params["?continue_google_setup"]

    return callback => {
      if ($integrations && id) {
        history.replaceState({}, null, window.location.pathname)
        const integration = {
          name: IntegrationTypes.GOOGLE_SHEETS,
          ...$integrations[IntegrationTypes.GOOGLE_SHEETS],
        }

        const fields = { continueSetupId: id, sheetId: "" }

        callback(integration, fields)
      }
    }
  })
}
