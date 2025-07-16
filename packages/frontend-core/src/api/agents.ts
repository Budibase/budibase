import {
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  ChatAgentRequest,
  ChatAgentResponse,
  CreateToolSourceRequest,
  FetchAgentHistoryResponse,
  LLMStreamChunk,
} from "@budibase/types"

import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  agentChat: (chat: AgentChat) => Promise<ChatAgentResponse>
  agentChatStream: (
    chat: AgentChat,
    onChunk: (chunk: LLMStreamChunk) => void,
    onError?: (error: Error) => void
  ) => Promise<void>

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

  agentChatStream: async (chat, onChunk, onError) => {
    const body: ChatAgentRequest = chat

    try {
      // TODO: add support for streaming into the frontend-core API object
      const response = await fetch("/api/agent/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        credentials: "same-origin",
      })

      if (!response.ok) {
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
              if (data.trim()) {
                const chunk: LLMStreamChunk = JSON.parse(data)
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
