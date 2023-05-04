import BullQueue from "bull"
import { createQueue, JobQueue } from "../../queue"
import { Event, Identity } from "@budibase/types"

export interface EventPayload {
  event: Event
  identity: Identity
  properties: any
  timestamp?: string | number
}

export let asyncEventQueue: BullQueue.Queue

export function init() {
  asyncEventQueue = createQueue<EventPayload>(JobQueue.SYSTEM_EVENT_QUEUE)
}

export async function shutdown() {
  if (asyncEventQueue) {
    await asyncEventQueue.close()
  }
}
