import { BasicPaginationRequest, PaginationResponse } from "../"
import { User, Workspace } from "../../../"
import { Event, IdentityType } from "../../../sdk"

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

export interface AuditLogServiceAccount {
  _id: string
  name: string
  status: string
  type: IdentityType.SERVICE_ACCOUNT
}

export interface AuditLogEnriched {
  app?: Workspace | DeletedResourceInfo
  user: User | DeletedResourceInfo | AuditLogServiceAccount
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
