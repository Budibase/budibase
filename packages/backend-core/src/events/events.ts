import { Event } from "@budibase/types"
import { processors } from "./processors"
import * as identification from "./identification"
import * as backfill from "./backfill"
import { emitter, EmittedEvent } from "./emit"
import * as context from "../context"
import * as logging from "../logging"

const USE_EMITTER: any[] = [
  Event.SERVED_BUILDER,
  Event.SERVED_APP,
  Event.SERVED_APP_PREVIEW,
]

for (let event of USE_EMITTER) {
  emitter.on(event, async (props: EmittedEvent) => {
    try {
      await context.doInTenant(props.tenantId, async () => {
        if (props.appId) {
          await context.doInAppContext(props.appId, async () => {
            await processors.processEvent(
              event as Event,
              props.identity,
              props.properties
            )
          })
        } else {
          await processors.processEvent(
            event as Event,
            props.identity,
            props.properties
          )
        }
      })
    } catch (e) {
      logging.logAlert(`Unable to process async event ${event}`, e)
    }
  })
}

export const publishEvent = async (
  event: Event,
  properties: any,
  timestamp?: string | number
) => {
  // in future this should use async events via a distributed queue.
  const identity = await identification.getCurrentIdentity()

  if (USE_EMITTER.includes(event)) {
    emitter.emitEvent(event, properties, identity)
    return
  }

  const backfilling = await backfill.isBackfillingEvent(event)
  // no backfill - send the event and exit
  if (!backfilling) {
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
