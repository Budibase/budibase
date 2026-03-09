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

function sanitizeBookmarkQuery(bookmark?: string): string | undefined {
  const normalizedBookmark = bookmark?.trim()
  if (!normalizedBookmark) {
    return undefined
  }

  if (!/^\d+$/.test(normalizedBookmark)) {
    throw new HTTPError("Invalid bookmark query", 400)
  }

  return normalizedBookmark
}

function sanitizeLimitQuery(limit?: string): number | undefined {
  const normalizedLimit = limit?.trim()
  if (!normalizedLimit) {
    return undefined
  }

  if (!/^\d+$/.test(normalizedLimit)) {
    throw new HTTPError("Invalid limit query", 400)
  }

  const parsedLimit = Number.parseInt(normalizedLimit, 10)
  if (parsedLimit < 1 || parsedLimit > 100) {
    throw new HTTPError("Limit query must be between 1 and 100", 400)
  }

  return parsedLimit
}

export async function fetchAgentLogs(
  ctx: UserCtx<void, FetchAgentLogsResponse>
) {
  const { agentId } = ctx.params
  const { startDate, endDate, bookmark, limit, statusFilter, triggerFilter } =
    ctx.query as Record<string, string>
  const defaults = getDefaultLogRange()

  ctx.body = await sdk.ai.agentLogs.fetchSessions(
    agentId,
    startDate || defaults.startDate,
    endDate || defaults.endDate,
    sanitizeBookmarkQuery(bookmark),
    sanitizeLimitQuery(limit),
    statusFilter,
    triggerFilter
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
  ctx.body = await sdk.ai.agentLogs.fetchRequestDetail(agentId, requestId)
}
