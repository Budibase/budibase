import {
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  ChatAgentRequest,
  CreateAgentRequest,
  CreateAgentResponse,
  CreateToolSourceRequest,
  FetchAgentHistoryResponse,
  FetchAgentsResponse,
  UpdateAgentRequest,
  UpdateAgentResponse,
} from "@budibase/types"

import { Header } from "@budibase/shared-core"
import { BaseAPIClient } from "./types"
import { UIMessageChunk } from "ai"

export interface AgentEndpoints {
  agentChatStream: (
    chat: AgentChat,
    workspaceId: string,
    onChunk: (chunk: UIMessageChunk) => void,
    onError?: (error: Error) => void
  ) => Promise<void>

  removeChat: (chatId: string) => Promise<void>
  fetchChats: (agentId: string) => Promise<FetchAgentHistoryResponse>

  fetchToolSources: (agentId: string) => Promise<AgentToolSourceWithTools[]>
  createToolSource: (
    toolSource: CreateToolSourceRequest
  ) => Promise<{ created: true }>
  updateToolSource: (toolSource: AgentToolSource) => Promise<AgentToolSource>
  deleteToolSource: (toolSourceId: string) => Promise<{ deleted: true }>
  fetchAgents: () => Promise<FetchAgentsResponse>
  createAgent: (agent: CreateAgentRequest) => Promise<CreateAgentResponse>
  updateAgent: (agent: UpdateAgentRequest) => Promise<UpdateAgentResponse>
  deleteAgent: (agentId: string) => Promise<{ deleted: true }>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  agentChatStream: async (chat, workspaceId, onChunk, onError) => {
    const body: ChatAgentRequest = chat

    try {
      const response = await fetch("/api/agent/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          [Header.APP_ID]: workspaceId,
        },
        body: JSON.stringify(body),
        credentials: "same-origin",
      })

      if (!response.ok) {
        const body = await response.json()

        if (body.message) {
          throw new Error(body.message)
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Failed to get response reader")
      }

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete lines
        const lines = buffer.split("\n")
        buffer = lines.pop() || "" // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = line.slice(6) // Remove 'data: ' prefix
              const trimmedData = data.trim()
              if (trimmedData && trimmedData !== "[DONE]") {
                const chunk: UIMessageChunk = JSON.parse(data)
                onChunk(chunk)
              }
            } catch (parseError) {
              console.error("Failed to parse SSE data:", parseError)
            }
          }
        }
      }
    } catch (error: any) {
      if (onError) {
        onError(error)
      } else {
        throw error
      }
    }
  },

  removeChat: async (chatId: string) => {
    return await API.delete({
      url: `/api/agent/chats/${chatId}`,
    })
  },

  fetchChats: async (agentId: string) => {
    return await API.get({
      url: `/api/agent/${agentId}/chats`,
    })
  },

  fetchToolSources: async (agentId: string) => {
    return await API.get({
      url: `/api/agent/${agentId}/toolsource`,
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

  fetchAgents: async () => {
    return await API.get({
      url: "/api/agent",
    })
  },

  createAgent: async (agent: CreateAgentRequest) => {
    return await API.post({
      url: "/api/agent",
      body: agent,
    })
  },

  updateAgent: async (agent: UpdateAgentRequest) => {
    return await API.put({
      url: "/api/agent",
      body: agent,
    })
  },

  deleteAgent: async (agentId: string) => {
    return await API.delete({
      url: `/api/agent/${agentId}`,
    })
  },
})
