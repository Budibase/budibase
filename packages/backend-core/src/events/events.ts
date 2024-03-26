import { Event, Identity } from "@budibase/types"
import { processors } from "./processors"
import identification from "./identification"
import * as backfill from "./backfill"
import { publishAsyncEvent } from "./asyncEvents"

export const publishEvent = async (
  event: Event,
  properties: any,
  timestamp?: string | number,
  identityOverride?: Identity
) => {
  // in future this should use async events via a distributed queue.
  const identity =
    identityOverride || (await identification.getCurrentIdentity())

  // Backfilling is get from the user cache, but when we override the identity cache is not available. Overrides are
  // normally performed in automatic actions or operations in async flows (BPM) where the user session is not available.
  const backfilling = identityOverride
    ? false
    : await backfill.isBackfillingEvent(event)

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
