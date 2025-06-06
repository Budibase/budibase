import {
  Event,
  Identity,
  IdentityType,
  AuditLogQueueEvent,
  AuditLogFn,
  HostInfo,
} from "@budibase/types"
import { EventProcessor } from "./types"
import { getAppId, doInTenant, getTenantId } from "../../context"
import { BudibaseQueue, JobQueue } from "../../queue"
import { isAudited } from "../../utils"
import env from "../../environment"

export default class AuditLogsProcessor implements EventProcessor {
  static auditLogsEnabled = false
  static auditLogQueue: BudibaseQueue<AuditLogQueueEvent>

  // can't use constructor as need to return promise
  static init(fn: AuditLogFn) {
    AuditLogsProcessor.auditLogsEnabled = true
    const writeAuditLogs = fn
    AuditLogsProcessor.auditLogQueue = new BudibaseQueue<AuditLogQueueEvent>(
      JobQueue.AUDIT_LOG,
      {
        jobTags: (event: AuditLogQueueEvent) => {
          return {
            "event.name": event.event,
          }
        },
      }
    )
    return AuditLogsProcessor.auditLogQueue.process(async job => {
      await doInTenant(job.data.tenantId, async () => {
        let properties = job.data.properties
        if (properties.audited) {
          properties = {
            ...properties,
            ...properties.audited,
          }
          delete properties.audited
        }

        // this feature is disabled by default due to privacy requirements
        // in some countries - available as env var in-case it is desired
        // in self host deployments
        let hostInfo: HostInfo | undefined = {}
        if (env.ENABLE_AUDIT_LOG_IP_ADDR) {
          hostInfo = job.data.opts.hostInfo
        }

        await writeAuditLogs(job.data.event, properties, {
          userId: job.data.opts.userId,
          timestamp: job.data.opts.timestamp,
          appId: job.data.opts.appId,
          hostInfo,
        })
      })
    })
  }

  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string
  ): Promise<void> {
    if (AuditLogsProcessor.auditLogsEnabled && isAudited(event)) {
      // only audit log actual events, don't include backfills
      const userId =
        identity.type === IdentityType.USER ? identity.id : undefined
      // add to the event queue, rather than just writing immediately
      await AuditLogsProcessor.auditLogQueue.add({
        event,
        properties,
        opts: {
          userId,
          timestamp,
          appId: getAppId(),
          hostInfo: identity.hostInfo,
        },
        tenantId: getTenantId(),
      })
    }
  }

  async identify() {
    // no-op
  }

  async identifyGroup() {
    // no-op
  }

  async shutdown(): Promise<void> {
    await AuditLogsProcessor.auditLogQueue?.close()
  }
}
