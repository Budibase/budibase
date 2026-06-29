import type { FetchAgentRequestsResponse } from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface AgentRequestEndpoints {
  fetchAgentRequests: (opts?: {
    limit?: number
    page?: number
  }) => Promise<FetchAgentRequestsResponse>
}

export const buildAgentRequestEndpoints = (
  API: BaseAPIClient
): AgentRequestEndpoints => ({
  fetchAgentRequests: async (opts = {}) => {
    const params = new URLSearchParams()
    if (opts.limit !== undefined) {
      params.set("limit", String(opts.limit))
    }
    if (opts.page !== undefined) {
      params.set("page", String(opts.page))
    }

    const query = params.toString()
    return await API.get({
      url: `/api/agent/requests${query ? `?${query}` : ""}`,
    })
  },
})
