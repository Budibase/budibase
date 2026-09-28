import { Duration } from "../Duration"

export const APPROVAL_REQUIRED_TITLE_PREFIX = "Approval required:"
export const MAX_REVIEW_PARAMETERS = 40
export const MAX_REVIEW_PARAMETER_NAME_LENGTH = 250

export const ESCALATION_DURATION_PRESETS = {
  ONE_DAY: Duration.fromDays(1).toSeconds(),
  THREE_DAYS: Duration.fromDays(3).toSeconds(),
  ONE_WEEK: Duration.fromDays(7).toSeconds(),
  THIRTY_DAYS: Duration.fromDays(30).toSeconds(),
  NINETY_DAYS: Duration.fromDays(90).toSeconds(),
} as const

export const DEFAULT_ESCALATION_DURATION_SECONDS =
  ESCALATION_DURATION_PRESETS.ONE_DAY
