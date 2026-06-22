import { HTTPError } from "@budibase/backend-core"
import type { FetchAgentRequestsResponse, UserCtx } from "@budibase/types"
import sdk from "../../../sdk"

const sanitizeLimitQuery = (limit?: string): number => {
  const normalizedLimit = limit?.trim()
  if (!normalizedLimit) {
    return 10
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

export async function fetchAgentRequests(
  ctx: UserCtx<void, FetchAgentRequestsResponse>
) {
  const { agentId } = ctx.params
  const { limit } = ctx.query as Record<string, string>

  if (!agentId) {
    throw new HTTPError("agentId is required", 400)
  }

  await sdk.ai.agents.getOrThrow(agentId)

  const requests = await sdk.ai.agentRequests.fetchRequestsByAgent(agentId)
  ctx.body = {
    requests: requests.slice(0, sanitizeLimitQuery(limit)),
  }
}
