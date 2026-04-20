import type {
  FetchAgentTestSuiteResponse,
  RunAgentTestSuiteRequest,
  RunAgentTestSuiteResponse,
  UpdateAgentTestSuiteRequest,
  UpdateAgentTestSuiteResponse,
} from "@budibase/types"
import type { BaseAPIClient } from "./types"

export interface AgentTestEndpoints {
  fetchAgentTestSuite: (agentId: string) => Promise<FetchAgentTestSuiteResponse>
  updateAgentTestSuite: (
    agentId: string,
    body: UpdateAgentTestSuiteRequest
  ) => Promise<UpdateAgentTestSuiteResponse>
  runAgentTestSuite: (
    agentId: string,
    body?: RunAgentTestSuiteRequest
  ) => Promise<RunAgentTestSuiteResponse>
}

export const buildAgentTestEndpoints = (
  API: BaseAPIClient
): AgentTestEndpoints => ({
  fetchAgentTestSuite: async agentId => {
    return await API.get({
      url: `/api/agent/${agentId}/tests`,
    })
  },

  updateAgentTestSuite: async (agentId, body) => {
    return await API.put({
      url: `/api/agent/${agentId}/tests`,
      body,
    })
  },

  runAgentTestSuite: async (agentId, body) => {
    return await API.post({
      url: `/api/agent/${agentId}/tests/run`,
      body: body ?? {},
    })
  },
})
