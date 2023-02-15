import { Event } from "./events"

export type AuditWriteOpts = {
  appId?: string
  timestamp?: string | number
  userId?: string
}

export type AuditLogFn = (
  event: Event,
  metadata: any,
  opts: AuditWriteOpts
) => Promise<any>
