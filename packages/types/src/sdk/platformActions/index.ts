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

export const PLATFORM_ACTION_ENVIRONMENTS = ["prod", "dev"] as const

export type PlatformActionEnvironment =
  (typeof PLATFORM_ACTION_ENVIRONMENTS)[number]

export const PLATFORM_ACTION_CONTAINER_STATUSES = [
  "active",
  "waiting",
  "completed",
  "failed",
] as const

export type PlatformActionContainerStatus =
  (typeof PLATFORM_ACTION_CONTAINER_STATUSES)[number]

export const PLATFORM_ACTION_ASSET_TYPES = ["agent", "automation"] as const

export type PlatformActionAssetType =
  (typeof PLATFORM_ACTION_ASSET_TYPES)[number]

export interface PlatformActionAsset {
  type: PlatformActionAssetType
  id: string
  // Name at capture time, kept so renames/deletions don't rewrite history
  label: string
}

export const PLATFORM_ACTION_ORIGIN_TYPES = [
  "user",
  "agent",
  "automation",
  "schedule",
  "webhook",
  "system",
] as const

export type PlatformActionOriginType =
  (typeof PLATFORM_ACTION_ORIGIN_TYPES)[number]

export const PLATFORM_ACTION_SYSTEM_ORIGINS = [
  "row_change",
  "email",
  "reboot",
] as const

export type PlatformActionSystemOrigin =
  (typeof PLATFORM_ACTION_SYSTEM_ORIGINS)[number]

export interface PlatformActionUserOrigin {
  type: "user"
  // Absent for transient users, e.g. an unlinked Slack/Teams sender
  id?: string
  label?: string
}

export interface PlatformActionResourceOrigin {
  type: "agent" | "automation"
  id: string
  label: string
}

export interface PlatformActionScheduleOrigin {
  type: "schedule"
}

export interface PlatformActionWebhookOrigin {
  type: "webhook"
}

export interface PlatformActionSystemOriginRef {
  type: "system"
  id: PlatformActionSystemOrigin
}

export type PlatformActionOrigin =
  | PlatformActionUserOrigin
  | PlatformActionResourceOrigin
  | PlatformActionScheduleOrigin
  | PlatformActionWebhookOrigin
  | PlatformActionSystemOriginRef

export interface PlatformActionSessionMetadata {
  asset?: PlatformActionAsset
  triggeredBy?: PlatformActionOrigin
}

export interface PlatformActionSessionMetadataScope
  extends ActionSourceContext,
    PlatformActionSessionMetadata {}

export interface PlatformActionEvent extends Document, ActionSourceContext {
  environment: PlatformActionEnvironment
  eventName: string
  timestamp: string
  assetType?: string
  assetId?: string
  payload: Record<string, unknown>
}

export interface PlatformActionSessionIndexDoc
  extends Document,
    ActionSourceContext {
  environment: PlatformActionEnvironment
  status: PlatformActionContainerStatus
  actionCount: number
  assetType?: PlatformActionAssetType
  assetId?: string
  assetLabel?: string
  // Job timestamp of the snapshot above, so the earliest capture wins
  // regardless of delivery order
  assetCapturedAt?: string
  triggeredByType?: PlatformActionOriginType
  triggeredById?: string
  triggeredByLabel?: string
  triggeredByCapturedAt?: string
  startedAt: string
  statusUpdatedAt?: string
  updatedAt: string
  completedAt?: string
}

export interface PlatformActionSessionIndexJob extends ActionSourceContext {
  workspaceId: string
  environment: PlatformActionEnvironment
  indexId: string
  incrementsActionCount: boolean
  // Absent for a step-level action that isn't the run's terminal state. It
  // should record the action without asserting a container status.
  signal?: PlatformActionContainerStatus
  timestamp: string
  // Local history only - never part of the event properties, which are also
  // forwarded to external analytics
  metadata?: PlatformActionSessionMetadata
}

export interface PlatformActionSessionChange extends ActionSourceContext {
  workspaceId: string
  environment: PlatformActionEnvironment
}

export type PlatformActionSessionIndexedFn = (
  change: PlatformActionSessionChange
) => void

export interface ActionSessionChangeEvent {
  environment: PlatformActionEnvironment
  sessions: ActionSourceContext[]
  // More sessions changed than were listed, any session may be stale
  truncated?: boolean
}
