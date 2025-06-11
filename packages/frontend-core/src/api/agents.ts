import {
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  ChatAgentRequest,
  ChatAgentResponse,
  CreateToolSourceRequest,
  FetchAgentHistoryResponse,
} from "@budibase/types"
import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  agentChat: (chat: AgentChat) => Promise<ChatAgentResponse>

  removeChat: (historyId: string) => Promise<void>
  fetchChats: () => Promise<FetchAgentHistoryResponse>

  fetchToolSources: () => Promise<AgentToolSourceWithTools[]>
  createToolSource: (
    toolSource: CreateToolSourceRequest
  ) => Promise<{ created: true }>
  updateToolSource: (toolSource: AgentToolSource) => Promise<AgentToolSource>
  deleteToolSource: (toolSourceId: string) => Promise<{ deleted: true }>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  agentChat: async chat => {
    const body: ChatAgentRequest = chat
    return await API.post({
      url: "/api/agent/chat",
      body,
    })
  },

  removeChat: async (historyId: string) => {
    return await API.delete({
      url: `/api/agent/history/${historyId}`,
    })
  },

  fetchChats: async () => {
    return await API.get({
      url: "/api/agent/history",
    })
  },

  fetchToolSources: async () => {
    return await API.get({
      url: "/api/agent/toolsource",
    })
  },

  createToolSource: async (toolSource: CreateToolSourceRequest) => {
    return await API.post({
      url: "/api/agent/toolsource",
      body: toolSource as any,
    })
  },

  updateToolSource: async (toolSource: AgentToolSource) => {
    return await API.put({
      url: "/api/agent/toolsource",
      body: toolSource as any,
    })
  },

  deleteToolSource: async (toolSourceId: string) => {
    return await API.delete({
      url: `/api/agent/toolsource/${toolSourceId}`,
    })
  },
})
