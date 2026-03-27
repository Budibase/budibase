import { task } from "@trigger.dev/sdk/v3"
import { DEFAULT_TRIGGER_AUTOMATION_TASK_ID } from "../../packages/server/src/automations/triggerTask"

interface TriggerAutomationTaskPayload {
  queueName: string
  job: {
    data: Record<string, unknown>
    opts: Record<string, unknown>
    timestamp?: number
  }
}

const EXECUTE_PATH = "/api/ops/automations/execute"
const API_KEY_HEADER = "x-budibase-api-key"

function toError(err: unknown) {
  if (err instanceof Error) {
    return err
  }
  return new Error(typeof err === "string" ? err : "Unknown error")
}

function buildBaseUrlCandidates() {
  const configured =
    process.env.TRIGGER_AUTOMATION_EXECUTE_URL ||
    process.env.APPS_URL ||
    "http://localhost:4001"
  const normalized = configured.endsWith("/")
    ? configured.slice(0, -1)
    : configured
  const candidates = [normalized]
  if (normalized.includes("localhost")) {
    candidates.push(normalized.replace("localhost", "host.docker.internal"))
  }
  return [...new Set(candidates)]
}

export const budibaseAutomationRunner = task({
  id: DEFAULT_TRIGGER_AUTOMATION_TASK_ID,
  run: async (payload: TriggerAutomationTaskPayload) => {
    const apiKey = process.env.INTERNAL_API_KEY
    if (!apiKey) {
      throw new Error("INTERNAL_API_KEY is required to execute automation runs")
    }

    const requestBody = JSON.stringify(payload)
    let lastError: Error | undefined
    for (const baseUrl of buildBaseUrlCandidates()) {
      try {
        const response = await fetch(`${baseUrl}${EXECUTE_PATH}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            [API_KEY_HEADER]: apiKey,
          },
          body: requestBody,
        })
        if (!response.ok) {
          const text = await response.text()
          throw new Error(
            `Automation execution request failed (${response.status}): ${text}`
          )
        }
        return await response.json()
      } catch (err) {
        lastError = toError(err)
      }
    }

    throw (
      lastError ||
      new Error("Unable to execute automation run via Budibase server")
    )
  },
})
