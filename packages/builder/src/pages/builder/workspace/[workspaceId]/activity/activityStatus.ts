import type {
  AgentRequestStatus,
  PlatformActionContainerStatus,
} from "@budibase/types"

export type ActivityStatus = AgentRequestStatus | PlatformActionContainerStatus

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  active: "Processing",
  needs_input: "Needs input",
  waiting: "Waiting",
  completed: "Completed",
  failed: "Failed",
}
