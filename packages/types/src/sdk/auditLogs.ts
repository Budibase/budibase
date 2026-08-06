import { Event, HostInfo, IdentityType } from "./events"
import { AuditLogDoc } from "../documents"

export type AuditWriteOpts = {
  appId?: string
  timestamp?: string | number
  userId?: string
  hostInfo?: HostInfo
  identityType?: IdentityType
  serviceAccountName?: string
}

export type AuditLogFn = (
  event: Event,
  metadata: any,
  opts: AuditWriteOpts
) => Promise<AuditLogDoc | undefined>

export type AuditLogQueueEvent = {
  event: Event
  properties: any
  opts: AuditWriteOpts
  tenantId: string
}
