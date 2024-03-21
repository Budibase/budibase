import { Event } from "../../../sdk"
import { PaginationResponse, BasicPaginationRequest } from "../"
import { User, App } from "../../../"

export interface AuditLogSearchParams {
  userIds?: string[]
  appIds?: string[]
  events?: Event[]
  startDate?: string
  endDate?: string
  fullSearch?: string
  bookmark?: string
}

export interface DownloadAuditLogsRequest extends AuditLogSearchParams {}

export interface SearchAuditLogsRequest
  extends BasicPaginationRequest,
    AuditLogSearchParams {}

export enum AuditLogResourceStatus {
  DELETED = "deleted",
}

export type DeletedResourceInfo = {
  _id: string
  status: AuditLogResourceStatus
  email?: string
  name?: string
}

export interface AuditLogEnriched {
  app?: App | DeletedResourceInfo
  user: User | DeletedResourceInfo
  event: Event
  timestamp: string
  name: string
  metadata: any
}

export interface SearchAuditLogsResponse extends PaginationResponse {
  data: AuditLogEnriched[]
}

export interface DefinitionsAuditLogsResponse {
  events: Record<string, string>
}
