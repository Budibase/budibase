import type {
  AgentLogEnvironment,
  FetchAgentLogsResponse,
  AgentLogRequestDetail,
  AgentLogSession,
  UserCtx,
} from "@budibase/types"
import { Duration, HTTPError } from "@budibase/backend-core"
import sdk from "../../../sdk"

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/

function getDefaultLogRange() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - Duration.fromDays(7).toMs())

  return {
    startDate: sevenDaysAgo.toISOString(),
    endDate: now.toISOString(),
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

  const parsedBookmark = Number.parseInt(normalizedBookmark, 10)
  if (!Number.isFinite(parsedBookmark) || parsedBookmark < 1) {
    throw new HTTPError("Invalid bookmark query", 400)
  }

  return String(parsedBookmark)
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

function sanitizeDateQuery(
  value: string | undefined,
  queryName: "startDate" | "endDate"
): string | undefined {
  const normalizedValue = value?.trim()
  if (!normalizedValue) {
    return undefined
  }

  if (DATE_ONLY_REGEX.test(normalizedValue)) {
    return normalizedValue
  }

  const parsedDate = new Date(normalizedValue)
  if (!Number.isFinite(parsedDate.getTime())) {
    throw new HTTPError(`Invalid ${queryName} query`, 400)
  }

  return parsedDate.toISOString()
}

function sanitizeEnvironmentQuery(environment?: string): AgentLogEnvironment {
  const normalizedEnvironment = environment?.trim()
  if (
    normalizedEnvironment === "development" ||
    normalizedEnvironment === "production"
  ) {
    return normalizedEnvironment
  }

  throw new HTTPError("Invalid environment query", 400)
}

function getComparableDate(value: string, mode: "start" | "end"): number {
  const comparableValue = DATE_ONLY_REGEX.test(value)
    ? `${value}T${mode === "start" ? "00:00:00.000" : "23:59:59.999"}Z`
    : value

  return new Date(comparableValue).getTime()
}

export async function fetchAgentLogs(
  ctx: UserCtx<void, FetchAgentLogsResponse>
) {
  const { agentId } = ctx.params
  const { startDate, endDate, bookmark, limit, statusFilter, triggerFilter } =
    ctx.query as Record<string, string>
  const defaults = getDefaultLogRange()
  const sanitizedStartDate =
    sanitizeDateQuery(startDate, "startDate") || defaults.startDate
  const sanitizedEndDate =
    sanitizeDateQuery(endDate, "endDate") || defaults.endDate

  if (
    getComparableDate(sanitizedStartDate, "start") >
    getComparableDate(sanitizedEndDate, "end")
  ) {
    throw new HTTPError("startDate query must be before endDate query", 400)
  }
  ctx.body = await sdk.ai.agentLogs.fetchSessions(
    agentId,
    sanitizedStartDate,
    sanitizedEndDate,
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
  const { sessionId, environment } = ctx.query as Record<string, string>
  ctx.body = await sdk.ai.agentLogs.fetchSessionDetail(
    agentId,
    sessionId,
    sanitizeEnvironmentQuery(environment)
  )
}

export async function fetchAgentLogDetail(
  ctx: UserCtx<void, AgentLogRequestDetail>
) {
  const { agentId, requestId } = ctx.params
  ctx.body = await sdk.ai.agentLogs.fetchRequestDetail(agentId, requestId)
}
