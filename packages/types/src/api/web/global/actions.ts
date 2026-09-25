import type {
  PlatformActionContainerStatus,
  PlatformActionEnvironment,
  PlatformActionSourceType,
} from "../../../sdk"

export interface ActionsPagination {
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextBookmark?: string
  previousBookmark?: string
}

export interface ActionSession {
  sourceType: PlatformActionSourceType
  sourceId: string
  environment: PlatformActionEnvironment
  status: PlatformActionContainerStatus
  actionCount: number
  assetType?: string
  assetId?: string
  assetLabel?: string
  triggeredByType?: string
  triggeredById?: string
  triggeredByLabel?: string
  startedAt: string
  updatedAt: string
  completedAt?: string
}

export interface ActionSessionsSummary {
  total: number
  active: number
  waiting: number
  completed: number
  failed: number
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
  assetType?: string
  assetId?: string
  payload: Record<string, unknown>
}

export interface ActionEventsSummary {
  total: number
}

export interface FetchActionSessionEventsResponse {
  events: ActionEvent[]
  summary: ActionEventsSummary
  pagination: ActionsPagination
}
