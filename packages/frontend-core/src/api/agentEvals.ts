import type {
  FetchAgentEvalSuiteResponse,
  RunAgentEvalSuiteResponse,
  UpdateAgentEvalSuiteRequest,
  UpdateAgentEvalSuiteResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface AgentEvalEndpoints {
  fetchAgentEvalSuite: (agentId: string) => Promise<FetchAgentEvalSuiteResponse>
  updateAgentEvalSuite: (
    agentId: string,
    body: UpdateAgentEvalSuiteRequest
  ) => Promise<UpdateAgentEvalSuiteResponse>
  runAgentEvalSuite: (agentId: string) => Promise<RunAgentEvalSuiteResponse>
}

export const buildAgentEvalEndpoints = (
  API: BaseAPIClient
): AgentEvalEndpoints => ({
  fetchAgentEvalSuite: async agentId => {
    return await API.get({
      url: `/api/agent/${agentId}/evals`,
    })
  },

  updateAgentEvalSuite: async (agentId, body) => {
    return await API.put({
      url: `/api/agent/${agentId}/evals`,
      body,
    })
  },

  runAgentEvalSuite: async agentId => {
    return await API.post({
      url: `/api/agent/${agentId}/evals/run`,
    })
  },
})
