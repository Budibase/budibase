import {
  type GetWorkspaceHomeMetricsResponse,
  type UserCtx,
} from "@budibase/types"

const getUtcMonthWindow = () => {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  return {
    periodStart: start.toISOString(),
    periodEnd: now.toISOString(),
  }
}

export async function metrics(
  ctx: UserCtx<void, GetWorkspaceHomeMetricsResponse>
) {
  if (!ctx.appId) {
    ctx.throw(400, "Missing appId")
    return
  }

  const { periodStart, periodEnd } = getUtcMonthWindow()
  ctx.body = {
    totalUsers: 0,
    automationRunsThisMonth: 0,
    agentActionsThisMonth: 0,
    periodStart,
    periodEnd,
  }
}
