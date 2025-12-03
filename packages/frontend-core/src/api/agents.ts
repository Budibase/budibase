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
  Tool,
  UpdateAgentRequest,
  UpdateAgentResponse,
} from "@budibase/types"

import { Header } from "@budibase/shared-core"
import { BaseAPIClient } from "./types"
import { readUIMessageStream, UIMessage, UIMessageChunk } from "ai"
import { createSseToJsonTransformStream } from "../utils/utils"

export interface AgentEndpoints {
  agentChatStream: (
    chat: AgentChat,
    workspaceId: string
  ) => Promise<AsyncIterable<UIMessage>>

  removeChat: (chatId: string) => Promise<void>
  fetchChats: (agentId: string) => Promise<FetchAgentHistoryResponse>

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

    return readUIMessageStream({ stream: chunkStream })
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
