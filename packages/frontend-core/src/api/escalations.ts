import type {
  EscalationContextDoc,
  EscalationRespondResult,
  EscalationResponse,
  EscalationResult,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface EscalationEndpoints {
  fetchEscalationContext: (
    escalationId: string
  ) => Promise<EscalationContextDoc>
  fetchEscalationResult: (
    escalationId: string,
    signal?: AbortSignal
  ) => Promise<EscalationResult>
  resolveEscalation: (
    escalationId: string,
    response: EscalationResponse
  ) => Promise<EscalationRespondResult>
}

export const buildEscalationEndpoints = (
  API: BaseAPIClient
): EscalationEndpoints => ({
  fetchEscalationContext: async escalationId => {
    return await API.get({
      url: `/api/escalations/context/${escalationId}`,
    })
  },

  fetchEscalationResult: async (escalationId, signal) => {
    return await API.get({
      url: `/api/escalations/${escalationId}/result`,
      signal,
    })
  },

  resolveEscalation: async (escalationId, response) => {
    return await API.post({
      url: `/api/escalations/${escalationId}/resolve`,
      body: { response },
    })
  },
})
