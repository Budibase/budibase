import { AuditLogSearchParams } from "../../api"
import { BaseEvent } from "./event"

export interface AuditLogFilteredEvent extends BaseEvent {
  filters: AuditLogSearchParams
}

export interface AuditLogDownloadedEvent extends BaseEvent {
  filters: AuditLogSearchParams
}
