import type { AgentTestReviewer } from "@budibase/types"

export type TestCaseStatus = "passed" | "failed" | "error" | "idle"

export function getResultStatus(
  result?: { status: string } | null
): TestCaseStatus {
  if (!result) {
    return "idle"
  }
  if (
    result.status === "passed" ||
    result.status === "failed" ||
    result.status === "error"
  ) {
    return result.status
  }
  return "error"
}

export function resultSummary(result?: { status: string } | null): string {
  if (!result) {
    return "Not run yet"
  }
  if (result.status === "passed") {
    return "Passed"
  }
  if (result.status === "failed") {
    return "Failed"
  }
  return "Error"
}

export function statusToBadgeProps(status: TestCaseStatus): {
  green?: boolean
  red?: boolean
  grey?: boolean
} {
  switch (status) {
    case "passed":
      return { green: true }
    case "failed":
    case "error":
      return { red: true }
    default:
      return { grey: true }
  }
}

export function formatRunTime(dateStr?: string | null): string {
  if (!dateStr) {
    return "—"
  }
  return new Date(dateStr).toLocaleString()
}

export function getReviewerLabel(type: AgentTestReviewer["type"]): string {
  switch (type) {
    case "exact_match":
      return "Exact match"
    case "contains_text":
      return "Contains text"
    case "llm_judge":
      return "LLM judge"
    case "tool_used":
      return "Tool used"
  }
}

export function getReviewerConfigSummary(reviewer: AgentTestReviewer): string {
  switch (reviewer.type) {
    case "exact_match":
    case "contains_text":
      return reviewer.text
    case "llm_judge":
      return reviewer.rubric
    case "tool_used":
      return reviewer.tool
  }
}
