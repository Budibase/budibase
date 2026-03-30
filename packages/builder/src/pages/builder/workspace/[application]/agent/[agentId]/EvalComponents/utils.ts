export type EvalCaseStatus = "passed" | "failed" | "error" | "idle"

export function getResultStatus(
  result?: { status: string } | null
): EvalCaseStatus {
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

export function resultSummary(
  result?: { status: string } | null
): string {
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

export function statusToBadgeProps(status: EvalCaseStatus): {
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
