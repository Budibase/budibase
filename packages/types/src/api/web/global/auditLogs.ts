import { Event, AuditedEventFriendlyName } from "../../../sdk"
import { PaginationResponse, PaginationRequest } from "../"
import { User, App } from "../../../"

export interface AuditLogSearchParams {
  userId?: string[]
  appId?: string[]
  event?: Event[]
  startDate?: string
  endDate?: string
  metadataSearch?: string
}

export interface DownloadAuditLogsRequest extends AuditLogSearchParams {}

export interface SearchAuditLogsRequest
  extends PaginationRequest,
    AuditLogSearchParams {}

export enum AuditLogResourceStatus {
  DELETED = "deleted",
}

export interface AuditLogEnriched {
  app?: App | { _id: string; status: AuditLogResourceStatus }
  user: User | { _id: string; status: AuditLogResourceStatus }
  event: Event
  timestamp: string
  name: string
  metadata: any
}

export interface SearchAuditLogsResponse extends PaginationResponse {
  data: AuditLogEnriched[]
}

export interface DefinitionsAuditLogsResponse {
  events: typeof AuditedEventFriendlyName
}
