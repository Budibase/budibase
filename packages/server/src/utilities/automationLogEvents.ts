import { db, redis } from "@budibase/backend-core"
import { Automation } from "@budibase/types"
import Redis, { Cluster } from "ioredis"

const AUTOMATION_LOG_UPDATE_CHANNEL = "automation-log-update"

export interface AutomationLogUpdate {
  automationId: string
  appId: string
}

export type AutomationLogUpdateHandler = (update: AutomationLogUpdate) => void

let automationLogUpdateSubscriber: Redis | Cluster | undefined

export function getAutomationLogUpdateRooms(appId: string) {
  return [...new Set([appId, db.getDevWorkspaceID(appId)])]
}

export async function publishAutomationLogUpdate(automation: Automation) {
  if (!automation._id) {
    throw new Error("Automation ID is not set")
  }

  const client = await redis.clients.getSocketClient()
  await client.client.publish(
    AUTOMATION_LOG_UPDATE_CHANNEL,
    JSON.stringify({
      automationId: automation._id,
      appId: automation.appId,
    })
  )
}

export async function subscribeToAutomationLogUpdates(
  handler: AutomationLogUpdateHandler
) {
  if (!automationLogUpdateSubscriber) {
    const client = await redis.clients.getSocketClient()
    automationLogUpdateSubscriber = client.client.duplicate()
    await automationLogUpdateSubscriber.subscribe(AUTOMATION_LOG_UPDATE_CHANNEL)
  } else {
    automationLogUpdateSubscriber.removeAllListeners("message")
  }

  automationLogUpdateSubscriber.on("message", (channel, payload) => {
    if (channel !== AUTOMATION_LOG_UPDATE_CHANNEL) {
      return
    }

    try {
      const update = JSON.parse(payload)
      if (
        typeof update.automationId !== "string" ||
        typeof update.appId !== "string"
      ) {
        return
      }

      handler({
        automationId: update.automationId,
        appId: update.appId,
      })
    } catch (e) {
      console.error("Error handling automation log update", e)
    }
  })
}
