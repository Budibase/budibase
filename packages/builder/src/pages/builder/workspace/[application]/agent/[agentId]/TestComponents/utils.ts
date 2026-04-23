export type VerdictStatus = "passed" | "failed" | "error" | "idle"

export interface VerdictMeta {
  label: string
  icon: string
  tone: VerdictStatus
  color: string
}

const VERDICT_META: Record<VerdictStatus, VerdictMeta> = {
  passed: {
    label: "Passed",
    icon: "check-circle",
    tone: "passed",
    color: "var(--color-green-500)",
  },
  failed: {
    label: "Failed",
    icon: "warning",
    tone: "failed",
    color: "var(--color-orange-500)",
  },
  error: {
    label: "Error",
    icon: "warning",
    tone: "error",
    color: "var(--color-orange-500)",
  },
  idle: {
    label: "Not run",
    icon: "circle-dashed",
    tone: "idle",
    color: "#7c7c7c",
  },
}

export const getVerdictMeta = (
  status: VerdictStatus | undefined
): VerdictMeta => VERDICT_META[status ?? "idle"]

export const formatRunTime = (dateStr: string): string =>
  new Date(dateStr).toLocaleString()
