import { derived } from "svelte/store"
import { params } from "@roxi/routify"
import { integrations } from "@/stores/builder"
import { notifications } from "@budibase/bbui"
import { SourceName, type UIIntegration } from "@budibase/types"

export const createOnGoogleAuthStore = () => {
  return derived([params, integrations], ([$params, $integrations]) => {
    const googleSheetsIntegration = $integrations.GOOGLE_SHEETS
    if (!googleSheetsIntegration) {
      const error = "Googlesheet integration not configured"
      notifications.error(error)
      throw new Error(error)
    }

    const id = $params["?continue_google_setup"]

    return (
      callback: (
        integration: UIIntegration,
        {
          continueSetupId,
          sheetId,
        }: { continueSetupId: string; sheetId: string }
      ) => void
    ) => {
      if ($integrations && id) {
        history.replaceState({}, "", window.location.pathname)
        const integration = {
          name: SourceName.GOOGLE_SHEETS,
          ...googleSheetsIntegration,
        }

        const fields = { continueSetupId: id, sheetId: "" }

        callback(integration, fields)
      }
    }
  })
}
