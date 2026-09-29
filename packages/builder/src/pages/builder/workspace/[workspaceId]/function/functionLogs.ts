import dayjs from "dayjs"
import type {
  FunctionEnvironment,
  FunctionRunSummaryStatus,
} from "@budibase/types"

export const functionRunStatusLabels: Record<FunctionRunSummaryStatus, string> =
  {
    running: "Running",
    success: "Success",
    error: "Error",
    stopped: "Stopped",
  }

export const functionEnvironmentLabels: Record<FunctionEnvironment, string> = {
  development: "Development",
  published: "Published",
}

export const formatFunctionRunTimestamp = (value: string) =>
  dayjs(value).format("MMM D, YYYY, h:mm:ss A")

export const formatFunctionRunDuration = (durationMs?: number) => {
  if (durationMs === undefined) {
    return "—"
  }
  if (durationMs < 1000) {
    return `${durationMs} ms`
  }
  return `${(durationMs / 1000).toFixed(1)} s`
}
