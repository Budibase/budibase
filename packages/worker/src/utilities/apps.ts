import fetch from "node-fetch"
import { constants } from "@budibase/backend-core"
import env from "../environment"

export async function triggerAutomation(
  appId: string,
  automationId: string,
  parameters: Record<string, any>
) {
  if (!env.INTERNAL_API_KEY) {
    throw new Error("No API key, cannot trigger automation")
  }
  const res = await fetch(`/api/automations/${automationId}/trigger`, {
    method: "POST",
    body: JSON.stringify(parameters),
    headers: {
      [constants.Header.APP_ID]: appId,
      [constants.Header.API_KEY]: env.INTERNAL_API_KEY,
    },
  })
  if (res.status >= 300) {
    throw new Error(await res.text())
  } else {
    return res.json()
  }
}
