import { Event, AuditedEventFriendlyName } from "../../../sdk"
import { PaginationResponse, PaginationRequest } from "../"

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

export interface SearchAuditLogsResponse extends PaginationResponse {
  data: {
    app: {
      _id: string
      name: string
    }
    user: {
      _id: string
      name: string
    }
    event: Event
    timestamp: string
    name: string
    metadata: any
  }[]
}

export interface DefinitionsAuditLogsResponse {
  events: typeof AuditedEventFriendlyName
}
