import {
  type GetWorkspaceHomeMetricsResponse,
  type UserCtx,
} from "@budibase/types"

import { getWorkspaceHomeMetrics } from "../../services/workspaceHome/metrics"

export async function metrics(
  ctx: UserCtx<void, GetWorkspaceHomeMetricsResponse>
) {
  if (!ctx.appId) {
    ctx.throw(400, "Missing appId")
  }

  ctx.body = await getWorkspaceHomeMetrics(ctx.appId)
}
