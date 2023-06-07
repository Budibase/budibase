import { AsyncEvents } from "@budibase/types"
import { EventPayload, asyncEventQueue, init } from "./queue"

export async function publishAsyncEvent(payload: EventPayload) {
  if (!asyncEventQueue) {
    init()
  }
  const { event, identity } = payload
  if (AsyncEvents.indexOf(event) !== -1 && identity.tenantId) {
    await asyncEventQueue.add(payload)
  }
}
