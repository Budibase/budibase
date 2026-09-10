import type {
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSourceType,
} from "../../../sdk/platformActions"

export interface ActionSession {
  sourceType: PlatformActionSourceType
  sourceId: string
  environment: PlatformActionEnvironment
  status: PlatformActionContainerStatus
  actionCount: number
  startedAt: string
  updatedAt: string
  completedAt?: string
}

export type ActionSessionsSummary = Record<
  PlatformActionContainerStatus,
  number
> & {
  total: number
}

export interface ActionsPagination {
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextBookmark?: string
  previousBookmark?: string
}

export interface FetchActionSessionsRequest {
  env?: PlatformActionEnvironment
  status?: PlatformActionContainerStatus
  bookmark?: string
  limit?: number
}

export interface FetchActionSessionsResponse {
  sessions: ActionSession[]
  summary: ActionSessionsSummary
  pagination: ActionsPagination
}

export interface ActionEvent {
  id: string
  eventName: string
  timestamp: string
  payload: Record<string, unknown>
}

export interface ActionEventsSummary {
  total: number
}

export interface FetchActionSessionEventsRequest {
  env: PlatformActionEnvironment
  bookmark?: string
  limit?: number
}

export interface FetchActionSessionEventsResponse {
  events: ActionEvent[]
  summary: ActionEventsSummary
  pagination: ActionsPagination
}
