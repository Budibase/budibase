import {
  AgentToolSource,
  AgentToolSourceWithTools,
  ChatAgentRequest,
  ChatConversation,
  ChatApp,
  CreateAgentRequest,
  CreateAgentResponse,
  CreateToolSourceRequest,
  FetchAgentHistoryResponse,
  FetchAgentsResponse,
  Tool,
  UpdateAgentRequest,
  UpdateAgentResponse,
  UpdateChatAppRequest,
} from "@budibase/types"

import { Header } from "@budibase/shared-core"
import { BaseAPIClient } from "./types"
import { readUIMessageStream, UIMessage, UIMessageChunk } from "ai"
import { createSseToJsonTransformStream } from "../utils/utils"

export interface AgentEndpoints {
  agentChatStream: (
    chat: ChatConversation,
    workspaceId: string
  ) => Promise<AsyncIterable<UIMessage>>

  removeChat: (chatId: string) => Promise<void>
  fetchChats: (chatAppId: string) => Promise<FetchAgentHistoryResponse>
  fetchChatApp: (
    agentId?: string,
    workspaceId?: string
  ) => Promise<ChatApp | null>
  updateChatApp: (chatApp: UpdateChatAppRequest) => Promise<ChatApp>

  fetchToolSources: (agentId: string) => Promise<AgentToolSourceWithTools[]>
  fetchAvailableTools: (toolSourceType: string) => Promise<Tool[]>
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

const throwOnErrorChunk = () =>
  new TransformStream<UIMessageChunk, UIMessageChunk>({
    transform(chunk, controller) {
      if (chunk.type === "error") {
        throw new Error(chunk.errorText || "Agent action failed")
      }
      controller.enqueue(chunk)
    },
  })

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  agentChatStream: async (chat, workspaceId) => {
    const body: ChatAgentRequest = chat

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
      const errorBody = await response.json()
      throw new Error(
        errorBody.message || `HTTP error! status: ${response.status}`
      )
    }

    if (!response.body) {
      throw new Error("Failed to get response body")
    }

    const chunkStream = response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(createSseToJsonTransformStream<UIMessageChunk>())
      .pipeThrough(throwOnErrorChunk())

    return readUIMessageStream({
      stream: chunkStream,
      terminateOnError: true,
    })
  },

  removeChat: async (chatId: string) => {
    return await API.delete({
      url: `/api/agent/chats/${chatId}`,
    })
  },

  fetchChats: async (chatAppId: string) => {
    return await API.get({
      url: `/api/chatapp/${chatAppId}/chats`,
    })
  },

  fetchChatApp: async (agentId?: string, workspaceId?: string) => {
    const query = agentId ? `?agentId=${encodeURIComponent(agentId)}` : ""
    const headers = workspaceId
      ? {
          [Header.APP_ID]: workspaceId,
        }
      : undefined
    return await API.get({
      url: `/api/chatapp${query}`,
      ...(headers && { headers }),
    })
  },

  updateChatApp: async (chatApp: UpdateChatAppRequest) => {
    return await API.put({
      url: "/api/chatapp",
      body: chatApp as any,
    })
  },

  fetchToolSources: async (agentId: string) => {
    return await API.get({
      url: `/api/agent/${agentId}/toolsource`,
    })
  },

  fetchAvailableTools: async (toolSourceType: string) => {
    return await API.get({
      url: `/api/agent/toolsource/${toolSourceType}/tools`,
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
