import type {
  FetchAgentLogsResponse,
  AgentLogRequestDetail,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

export async function fetchAgentLogs(ctx: UserCtx<void, FetchAgentLogsResponse>) {
  const { agentId } = ctx.params
  const {
    startDate,
    endDate,
    page = "0",
    pageSize = "20",
  } = ctx.query as Record<string, string>

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  ctx.body = await sdk.ai.agentLogs.fetchSessions(
    agentId,
    startDate || sevenDaysAgo.toISOString().split("T")[0],
    endDate || tomorrow.toISOString().split("T")[0],
    parseInt(page),
    parseInt(pageSize)
  )
}

export async function fetchAgentLogDetail(
  ctx: UserCtx<void, AgentLogRequestDetail>
) {
  const { requestId } = ctx.params
  const { startDate } = ctx.query as Record<string, string>

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  ctx.body = await sdk.ai.agentLogs.fetchRequestDetail(
    requestId,
    startDate || sevenDaysAgo.toISOString().split("T")[0]
  )
}
