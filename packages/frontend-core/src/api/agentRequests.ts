import type { FetchAgentRequestsResponse } from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface AgentRequestEndpoints {
  fetchAgentRequests: (
    agentId: string,
    opts?: {
      limit?: number
    }
  ) => Promise<FetchAgentRequestsResponse>
}

export const buildAgentRequestEndpoints = (
  API: BaseAPIClient
): AgentRequestEndpoints => ({
  fetchAgentRequests: async (agentId, opts = {}) => {
    const params = new URLSearchParams()
    if (opts.limit !== undefined) {
      params.set("limit", String(opts.limit))
    }

    const query = params.toString()
    return await API.get({
      url: `/api/agent/${agentId}/requests${query ? `?${query}` : ""}`,
    })
  },
})
