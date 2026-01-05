export type ChainStepStatus = "completed" | "error" | "failed" | "pending"

export const getStatusLightColor = (status: ChainStepStatus): string => {
  switch (status) {
    case "completed":
      return "var(--spectrum-global-color-green-600)"
    case "error":
    case "failed":
      return "var(--spectrum-global-color-red-600)"
    case "pending":
    default:
      return "var(--spectrum-global-color-gray-600)"
  }
}

export const getStatusLabel = (status: ChainStepStatus): string => {
  switch (status) {
    case "completed":
      return "Completed"
    case "error":
    case "failed":
      return "Failed"
    case "pending":
      return "Running"
    default:
      return "Unknown"
  }
}

export const getStatusBadgeClass = (status: ChainStepStatus): string => {
  switch (status) {
    case "completed":
      return "badge-positive"
    case "error":
    case "failed":
      return "badge-negative"
    case "pending":
    default:
      return "badge-neutral"
  }
}

export const getStatusActionButtonClass = (status: ChainStepStatus): string => {
  switch (status) {
    case "completed":
      return "flow-success"
    case "error":
    case "failed":
      return "flow-error"
    case "pending":
      return "flow-blue"
    default:
      return "flow-warn"
  }
}
