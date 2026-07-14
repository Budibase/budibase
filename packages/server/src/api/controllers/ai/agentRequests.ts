import { HTTPError } from "@budibase/backend-core"
import {
  AGENT_REQUEST_STATUSES,
  type AgentRequestStatus,
  type FetchAgentRequestsResponse,
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
  const { limit, page, status } = ctx.query as Record<string, string>
  const resolvedLimit = sanitizeLimitQuery(limit)
  const resolvedPage = sanitizePageQuery(page)
  const resolvedStatus = sanitizeStatusQuery(status)
  const [requests, summary] = await Promise.all([
    sdk.ai.agentRequests.fetchRequests({
      limit: resolvedLimit,
      page: resolvedPage,
      status: resolvedStatus,
    }),
    sdk.ai.agentRequests.fetchRequestsSummary(),
  ])
  ctx.body = {
    requests,
    summary,
  }
}
