import {
  type GetWorkspaceHomeMetricsResponse,
  type UserCtx,
} from "@budibase/types"

import { getWorkspaceHomeMetrics } from "../../services/workspaceHome/metrics"
import { context } from "@budibase/backend-core"

export async function metrics(
  ctx: UserCtx<void, GetWorkspaceHomeMetricsResponse>
) {
  const workspaceId = context.getWorkspaceId()
  if (!workspaceId) {
    ctx.throw(400, "Missing workspace context")
  }

  ctx.body = await getWorkspaceHomeMetrics(workspaceId)
}
