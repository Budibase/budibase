import { AuditLogFn, Event, IdentityType, HostInfo } from "@budibase/types"
import { processors } from "./processors"
import identification from "./identification"
import { getAppId } from "../context"
import * as backfill from "./backfill"
import { createQueue, JobQueue } from "../queue"
import BullQueue from "bull"

type AuditLogEvent = {
  event: Event
  properties: any
  opts: {
    timestamp?: string | number
    userId?: string
    appId?: string
    hostInfo?: HostInfo
  }
}

let auditLogsEnabled = false
let auditLogQueue: BullQueue.Queue<AuditLogEvent>

export const configure = (fn: AuditLogFn) => {
  auditLogsEnabled = true
  const writeAuditLogs = fn
  auditLogQueue = createQueue<AuditLogEvent>(JobQueue.AUDIT_LOG)
  return auditLogQueue.process(async job => {
    await writeAuditLogs(job.data.event, job.data.properties, {
      userId: job.data.opts.userId,
      timestamp: job.data.opts.timestamp,
      appId: job.data.opts.appId,
      hostInfo: job.data.opts.hostInfo,
    })
  })
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
    await processors.processEvent(event, identity, properties, timestamp)
    if (auditLogsEnabled) {
      // only audit log actual events, don't include backfills
      const userId =
        identity.type === IdentityType.USER ? identity.id : undefined
      // add to event queue, rather than just writing immediately
      await auditLogQueue.add({
        event,
        properties,
        opts: {
          userId,
          timestamp,
          appId: getAppId(),
        },
      })
    }
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
