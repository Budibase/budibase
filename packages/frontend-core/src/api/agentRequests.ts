import type {
  AgentRequestStatus,
  EscalationAction,
  EscalationRespondResult,
  FetchAgentRequestsResponse,
  FetchRequestsResponse,
  FindRequestResponse,
  RespondToEscalationRequest,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface AgentRequestEndpoints {
  fetchAgentRequests: (opts?: {
    limit?: number
    bookmark?: string
    status?: AgentRequestStatus
  }) => Promise<FetchAgentRequestsResponse>
  fetchUserRequests: (opts?: {
    awaitingMe?: boolean
    isRequester?: boolean
    page?: number
    limit?: number
  }) => Promise<FetchRequestsResponse>
  findUserRequest: (opts: {
    workspaceId: string
    requestId: string
  }) => Promise<FindRequestResponse>
  respondToEscalation: (opts: {
    workspaceId: string
    escalationId: string
    actionId: EscalationAction
    note?: string
  }) => Promise<EscalationRespondResult>
}

export const buildAgentRequestEndpoints = (
  API: BaseAPIClient
): AgentRequestEndpoints => ({
  fetchAgentRequests: async (opts = {}) => {
    const params = new URLSearchParams()
    if (opts.limit !== undefined) {
      params.set("limit", String(opts.limit))
    }
    if (opts.bookmark !== undefined) {
      params.set("bookmark", opts.bookmark)
    }
    if (opts.status !== undefined) {
      params.set("status", opts.status)
    }

    const query = params.toString()
    return await API.get({
      url: `/api/agent/requests${query ? `?${query}` : ""}`,
    })
  },

  fetchUserRequests: async (opts = {}) => {
    const params = new URLSearchParams()
    if (opts.awaitingMe !== undefined) {
      params.set("awaitingMe", String(opts.awaitingMe))
    }
    if (opts.isRequester !== undefined) {
      params.set("isRequester", String(opts.isRequester))
    }
    if (opts.page !== undefined) {
      params.set("page", String(opts.page))
    }
    if (opts.limit !== undefined) {
      params.set("limit", String(opts.limit))
    }

    const query = params.toString()
    return await API.get({
      url: `/api/requests${query ? `?${query}` : ""}`,
    })
  },

  findUserRequest: async ({ workspaceId, requestId }) => {
    return await API.get({
      url: `/api/requests/${requestId}?appId=${workspaceId}`,
    })
  },

  respondToEscalation: async ({
    workspaceId,
    escalationId,
    actionId,
    note,
  }) => {
    return await API.post<RespondToEscalationRequest, EscalationRespondResult>({
      url: `/api/escalations/${escalationId}/respond?appId=${workspaceId}`,
      body: { actionId, ...(note ? { note } : {}) },
    })
  },
})
