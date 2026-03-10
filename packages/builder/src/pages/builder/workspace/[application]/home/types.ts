import type { GetWorkspaceHomeMetricsResponse } from "@budibase/types"

export type WorkspaceHomeMetrics = GetWorkspaceHomeMetricsResponse & {
  operationsThisMonth: number
  budibaseAICreditsThisMonth: number
}
