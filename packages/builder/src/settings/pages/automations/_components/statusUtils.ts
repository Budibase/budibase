interface StatusInfo {
  color: "green" | "red" | "yellow"
  message: string
}

export const getAutomationStatusInfo = (value?: string | null): StatusInfo => {
  switch (value?.toLowerCase()) {
    case "stopped_error":
      return { color: "red", message: "Stopped - Error" }
    case "stopped":
      return { color: "yellow", message: "Stopped" }
    case undefined:
    case "":
    case "error":
      return { color: "red", message: "Error" }
    default:
      return { color: "green", message: "Success" }
  }
}
