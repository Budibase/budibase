import type {
  FetchAgentLogsResponse,
  AgentLogRequestDetail,
  AgentLogSession,
  UserCtx,
} from "@budibase/types"
import { HTTPError } from "@budibase/backend-core"
import sdk from "../../../sdk"

function getDefaultLogRange() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  return {
    startDate: sevenDaysAgo.toISOString().split(".")[0] + "Z",
    endDate: tomorrow.toISOString().split(".")[0] + "Z",
  }
}

function sanitizePageQuery(page?: string): number {
  const normalizedPage = page?.trim()

  if (!normalizedPage || !/^\d+$/.test(normalizedPage)) {
    throw new HTTPError("Invalid page query", 400)
  }

  return Number.parseInt(normalizedPage, 10)
}

export async function fetchAgentLogs(
  ctx: UserCtx<void, FetchAgentLogsResponse>
) {
  const { agentId } = ctx.params
  const { startDate, endDate, page = "0" } = ctx.query as Record<string, string>
  const defaults = getDefaultLogRange()

  ctx.body = await sdk.ai.agentLogs.fetchSessions(
    agentId,
    startDate || defaults.startDate,
    endDate || defaults.endDate,
    sanitizePageQuery(page)
  )
}

export async function fetchAgentLogSession(
  ctx: UserCtx<void, AgentLogSession | null>
) {
  const { agentId } = ctx.params
  const { sessionId } = ctx.query as Record<string, string>
  ctx.body = await sdk.ai.agentLogs.fetchSessionDetail(agentId, sessionId)
}

export async function fetchAgentLogDetail(
  ctx: UserCtx<void, AgentLogRequestDetail>
) {
  const { agentId, requestId } = ctx.params
  const { startDate } = ctx.query as Record<string, string>
  const defaults = getDefaultLogRange()

  ctx.body = await sdk.ai.agentLogs.fetchRequestDetail(
    agentId,
    requestId,
    startDate || defaults.startDate
  )
}
