import { Event, IdentityType, AuditLogFn } from "@budibase/types"
import { processors } from "./processors"
import identification from "./identification"
import { getAppId } from "../context"
import * as backfill from "./backfill"

let writeAuditLogs: AuditLogFn | undefined

export const initAuditLogs = (fn: AuditLogFn) => {
  writeAuditLogs = fn
}

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
    // only audit log actual events, don't include backfills
    const userId = identity.type === IdentityType.USER ? identity.id : undefined
    if (writeAuditLogs) {
      await writeAuditLogs(event, properties, {
        userId,
        timestamp,
        appId: getAppId(),
      })
    }
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
