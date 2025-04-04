import {
  ChatAgentRequest,
  ChatAgentResponse,
  SaveAgentHistoryRequest,
  SaveAgentHistoryResponse,
  FetchAgentHistoryResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  agentChat: (
    messages: { message: string; system?: boolean }[],
    appIds: string[]
  ) => Promise<ChatAgentResponse>

  saveHistory: (
    history: SaveAgentHistoryRequest
  ) => Promise<SaveAgentHistoryResponse>
  removeHistory: (historyId: string) => Promise<void>
  fetchHistory: () => Promise<FetchAgentHistoryResponse>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  /**
   * Generates a cron expression from a prompt
   */
  agentChat: async (messages, appIds) => {
    const body: ChatAgentRequest = {
      messages,
      appIds,
    }
    return await API.post({
      url: "/api/global/agent/chat",
      body,
    })
  },

  saveHistory: async (history: SaveAgentHistoryRequest) => {
    return await API.post({
      url: "/api/global/agent/history",
      body: history,
    })
  },

  removeHistory: async (historyId: string) => {
    return await API.delete({
      url: `/api/global/agent/history/${historyId}`,
    })
  },

  fetchHistory: async () => {
    return await API.get({
      url: "/api/global/agent/history",
    })
  },
})
