import type {
  AgentLogEnvironment,
  FetchAgentLogsResponse,
  AgentLogRequestDetail,
  AgentLogSession,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface AgentLogEndpoints {
  fetchAgentLogs: (
    agentId: string,
    opts?: {
      startDate?: string
      endDate?: string
      bookmark?: string
      limit?: number
      statusFilter?: string
      triggerFilter?: string
    }
  ) => Promise<FetchAgentLogsResponse>
  fetchAgentLogDetail: (
    agentId: string,
    requestId: string
  ) => Promise<AgentLogRequestDetail>
  fetchAgentLogSession: (
    agentId: string,
    sessionId: string,
    environment: AgentLogEnvironment
  ) => Promise<AgentLogSession | null>
}

export const buildAgentLogEndpoints = (
  API: BaseAPIClient
): AgentLogEndpoints => ({
  fetchAgentLogs: async (agentId, opts = {}) => {
    const params = new URLSearchParams()
    if (opts.startDate) params.set("startDate", opts.startDate)
    if (opts.endDate) params.set("endDate", opts.endDate)
    if (opts.bookmark) params.set("bookmark", opts.bookmark)
    if (opts.limit !== undefined) params.set("limit", String(opts.limit))
    if (opts.statusFilter) params.set("statusFilter", opts.statusFilter)
    if (opts.triggerFilter) params.set("triggerFilter", opts.triggerFilter)
    const query = params.toString()
    return await API.get({
      url: `/api/agent/${agentId}/logs${query ? `?${query}` : ""}`,
    })
  },

  fetchAgentLogDetail: async (agentId, requestId) => {
    return await API.get({
      url: `/api/agent/${agentId}/logs/${requestId}`,
    })
  },

  fetchAgentLogSession: async (agentId, sessionId, environment) => {
    const params = new URLSearchParams({ sessionId })
    params.set("environment", environment)
    return await API.get({
      url: `/api/agent/${agentId}/logs/session?${params.toString()}`,
    })
  },
})
