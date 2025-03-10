import type { BaseEvent } from "./event"
import type { AuditLogSearchParams } from "../../api"

export interface AuditLogFilteredEvent extends BaseEvent {
  filters: AuditLogSearchParams
}

export interface AuditLogDownloadedEvent extends BaseEvent {
  filters: AuditLogSearchParams
}
