import { Event } from "@budibase/types"
import { processors } from "./processors"
import * as identification from "./identification"

export const publishEvent = async (
  event: Event,
  properties: any,
  timestamp?: string | number
) => {
  // in future this should use async events via a distributed queue.
  const identity = await identification.getCurrentIdentity()
  await processors.processEvent(event, identity, properties, timestamp)
}
