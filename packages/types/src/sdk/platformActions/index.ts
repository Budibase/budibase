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
