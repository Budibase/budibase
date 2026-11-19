import { HTTPError } from "@budibase/backend-core"
import {
  AGENT_REQUEST_STATUSES,
  SortOrder,
  type AgentRequestStatus,
  type FetchAgentRequestsResponse,
  type FetchRequestsResponse,
  type FindRequestResponse,
  type UserCtx,
} from "@budibase/types"
import sdk from "../../../sdk"

const DEFAULT_LIMIT = 100

const sanitizeLimitQuery = (limit?: string): number => {
  const normalizedLimit = limit?.trim()
  if (!normalizedLimit) {
    return DEFAULT_LIMIT
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

const sanitizePageQuery = (page?: string): number => {
  const normalizedPage = page?.trim()
  if (!normalizedPage) {
    return 1
  }

  if (!/^\d+$/.test(normalizedPage)) {
    throw new HTTPError("Invalid page query", 400)
  }

  const parsedPage = Number.parseInt(normalizedPage, 10)
  if (parsedPage < 1) {
    throw new HTTPError("Page query must be greater than 0", 400)
  }

  return parsedPage
}

const sanitizeStatusQuery = (
  status?: string
): AgentRequestStatus | undefined => {
  const normalizedStatus = status?.trim()
  if (!normalizedStatus) {
    return undefined
  }

  if (
    !AGENT_REQUEST_STATUSES.includes(normalizedStatus as AgentRequestStatus)
  ) {
    throw new HTTPError("Invalid status query", 400)
  }

  return normalizedStatus as AgentRequestStatus
}

export async function fetchAgentRequests(
  ctx: UserCtx<void, FetchAgentRequestsResponse>
) {
  const { limit, bookmark, status } = ctx.query as Record<string, string>
  const [{ requests, bookmark: nextBookmark }, summary] = await Promise.all([
    sdk.ai.agentRequests.fetchRequests({
      limit: sanitizeLimitQuery(limit),
      bookmark: trimmedQuery(bookmark),
      status: sanitizeStatusQuery(status),
    }),
    sdk.ai.agentRequests.fetchRequestsSummary(),
  ])
  ctx.body = { requests, summary, bookmark: nextBookmark }
}

const sanitizeOneOfQuery = <T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  name: string
): T | undefined => {
  const normalized = value?.trim()
  if (!normalized) {
    return undefined
  }
  const match = allowed.find(option => option === normalized)
  if (!match) {
    throw new HTTPError(`Invalid ${name} query`, 400)
  }
  return match
}

const sanitizeBooleanQuery = (
  value: string | undefined,
  name: string
): boolean | undefined => {
  const match = sanitizeOneOfQuery(value, ["true", "false"], name)
  return match === undefined ? undefined : match === "true"
}

const trimmedQuery = (value: string | undefined) => value?.trim() || undefined

export async function fetchUserRequests(
  ctx: UserCtx<void, FetchRequestsResponse>
) {
  const query = ctx.query as Record<string, string | undefined>
  const page = sanitizePageQuery(query.page)
  const limit = sanitizeLimitQuery(query.limit)
  const filters = {
    isRequester: sanitizeBooleanQuery(query.isRequester, "isRequester"),
    isApprover: sanitizeBooleanQuery(query.isApprover, "isApprover"),
    awaitingMe: sanitizeBooleanQuery(query.awaitingMe, "awaitingMe"),
    awaitingOthers: sanitizeBooleanQuery(
      query.awaitingOthers,
      "awaitingOthers"
    ),
    responded: sanitizeBooleanQuery(query.responded, "responded"),
    status: sanitizeStatusQuery(query.status),
    workspaceId: trimmedQuery(query.workspaceId),
    agentId: trimmedQuery(query.agentId),
    operationId: trimmedQuery(query.operationId),
  }
  const order =
    sanitizeOneOfQuery(query.order, ["asc", "desc"], "order") === "asc"
      ? SortOrder.ASCENDING
      : SortOrder.DESCENDING

  const globalUserId = ctx.user?.globalId || ctx.user?._id
  if (!globalUserId) {
    ctx.body = { requests: [], page, hasNextPage: false }
    return
  }
  ctx.body = await sdk.ai.agentRequests.fetchRequestsForUser({
    globalUserId,
    filters,
    order,
    page,
    limit,
  })
}

export async function findUserRequest(
  ctx: UserCtx<void, FindRequestResponse, { id: string }>
) {
  const globalUserId = ctx.user?.globalId
  const request = globalUserId
    ? await sdk.ai.agentRequests.findRequestForUser({
        requestId: ctx.params.id,
        globalUserId,
      })
    : undefined
  if (!request) {
    throw new HTTPError("Request not found", 404)
  }
  ctx.body = request
}
