import { Event } from "@budibase/types"
import { processors } from "./processors"
import identification from "./identification"
import * as backfill from "./backfill"
import { publishAsyncEvent } from "./asyncEvents"

export const publishEvent = async (
  event: Event,
  properties: any,
  timestamp?: string | number
) => {
  // in future this should use async events via a distributed queue.
  const identity = await identification.getCurrentIdentity()

  const backfilling = await backfill.isBackfillingEvent(event)
  // no backfill - send the event and exit
  if (!backfilling) {
    // send off async events if required
    await publishAsyncEvent({
      event,
      identity,
      properties,
      timestamp,
    })
    // now handle the main sync event processing pipeline
    await processors.processEvent(event, identity, properties, timestamp)
    return
  }

  // backfill active - check if the event has been sent already
  const alreadySent = await backfill.isAlreadySent(event, properties)
  if (alreadySent) {
    // do nothing
    return
  } else {
    // send and record the event
    await processors.processEvent(event, identity, properties, timestamp)
    await backfill.recordEvent(event, properties)
  }
}
