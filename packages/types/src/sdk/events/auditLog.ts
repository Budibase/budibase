import { BaseEvent } from "./event"
import { AuditLogSearchParams } from "../../api"

export interface AuditLogFilterEvent extends BaseEvent {
  filters: AuditLogSearchParams
}

export interface AuditLogDownloadEvent extends BaseEvent {
  filters: AuditLogSearchParams
}
