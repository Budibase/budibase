import { REVIEWERS, describeReviewer } from "@budibase/shared-core"
import type { AgentTestReviewer } from "@budibase/types"

export function resultSummary(result?: { status: string } | null): string {
  if (!result) return "Not run yet"
  if (result.status === "passed") return "Passed"
  if (result.status === "failed") return "Failed"
  return "Error"
}

export function formatRunTime(dateStr?: string | null): string {
  return dateStr ? new Date(dateStr).toLocaleString() : "—"
}

export const getReviewerLabel = (type: AgentTestReviewer["type"]): string =>
  REVIEWERS[type].label

export const getReviewerConfigSummary = (
  reviewer: AgentTestReviewer
): string => describeReviewer(reviewer) ?? ""
