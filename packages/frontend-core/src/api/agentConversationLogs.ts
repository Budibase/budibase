import {
  DownloadAgentConversationLogsRequest,
  SearchAgentConversationLogsRequest,
  SearchAgentConversationLogsResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AgentConversationLogEndpoints {
  searchAgentConversationLogs: (
    opts: SearchAgentConversationLogsRequest
  ) => Promise<SearchAgentConversationLogsResponse>
  getAgentConversationLogDownloadUrl: (
    opts: DownloadAgentConversationLogsRequest
  ) => string
}

export const buildAgentConversationLogEndpoints = (
  API: BaseAPIClient
): AgentConversationLogEndpoints => ({
  searchAgentConversationLogs: async opts => {
    return await API.post({
      url: `/api/global/agentlogs/search`,
      body: opts,
    })
  },
  getAgentConversationLogDownloadUrl: opts => {
    const query = encodeURIComponent(JSON.stringify(opts))
    return `/api/global/agentlogs/download?query=${query}`
  },
})
