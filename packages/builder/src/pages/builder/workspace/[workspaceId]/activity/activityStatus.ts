import type {
  AgentRequestStatus,
  PlatformActionSessionStatus,
} from "@budibase/types"

export type ActivityStatus = AgentRequestStatus | PlatformActionSessionStatus

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  active: "Active",
  needs_input: "Needs input",
  waiting: "Waiting",
  completed: "Completed",
  failed: "Failed",
}
