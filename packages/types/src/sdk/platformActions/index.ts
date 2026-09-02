import type { Document } from "../../documents"

export const PLATFORM_ACTION_SOURCE_TYPES = [
  "agent_session",
  "automation_run",
  "app_session",
] as const

export type PlatformActionSourceType =
  (typeof PLATFORM_ACTION_SOURCE_TYPES)[number]

export interface ActionSourceContext {
  sourceType: PlatformActionSourceType
  sourceId: string
}

export const PLATFORM_ACTION_CONTAINER_STATUSES = [
  "active",
  "waiting",
  "completed",
  "failed",
] as const

export type PlatformActionContainerStatus =
  (typeof PLATFORM_ACTION_CONTAINER_STATUSES)[number]

export interface PlatformActionEvent extends Document, ActionSourceContext {
  eventName: string
  timestamp: string
  assetType?: string
  assetId?: string
  payload: Record<string, unknown>
}

export interface PlatformActionSessionIndexDoc
  extends Document,
    ActionSourceContext {
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

export const PLATFORM_ACTION_OUTCOMES = ["success", "failure"] as const

export type PlatformActionOutcome = (typeof PLATFORM_ACTION_OUTCOMES)[number]

export interface PlatformActionSessionIndexJob extends ActionSourceContext {
  workspaceId: string
  platformActionId: string
  eventName: string
  outcome: PlatformActionOutcome
  timestamp: string
}
