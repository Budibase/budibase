import type {
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
      page?: number
    }
  ) => Promise<FetchAgentLogsResponse>
  fetchAgentLogDetail: (
    agentId: string,
    requestId: string,
    startDate?: string
  ) => Promise<AgentLogRequestDetail>
  fetchAgentLogSession: (
    agentId: string,
    sessionId: string
  ) => Promise<AgentLogSession | null>
}

export const buildAgentLogEndpoints = (
  API: BaseAPIClient
): AgentLogEndpoints => ({
  fetchAgentLogs: async (agentId, opts = {}) => {
    const params = new URLSearchParams()
    if (opts.startDate) params.set("startDate", opts.startDate)
    if (opts.endDate) params.set("endDate", opts.endDate)
    if (opts.page !== undefined) params.set("page", String(opts.page))
    const query = params.toString()
    return await API.get({
      url: `/api/agent/${agentId}/logs${query ? `?${query}` : ""}`,
    })
  },

  fetchAgentLogDetail: async (agentId, requestId, startDate) => {
    const params = new URLSearchParams()
    if (startDate) params.set("startDate", startDate)
    const query = params.toString()
    return await API.get({
      url: `/api/agent/${agentId}/logs/${requestId}${query ? `?${query}` : ""}`,
    })
  },

  fetchAgentLogSession: async (agentId, sessionId) => {
    const params = new URLSearchParams({ sessionId })
    return await API.get({
      url: `/api/agent/${agentId}/logs/session?${params.toString()}`,
    })
  },
})
