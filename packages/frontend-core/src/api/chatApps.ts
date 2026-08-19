import {
  ChatAgentRequest,
  ChatConversation,
  ChatConversationRequest,
  CreateChatConversationRequest,
  FetchChatAppAgentsResponse,
  ChatApp,
  FetchAgentHistoryResponse,
  AgentMessageMetadata,
  FetchAgentFileUrlResponse,
} from "@budibase/types"
import { Header } from "@budibase/shared-core"
import { BaseAPIClient } from "./types"
import { readUIMessageStream, UIMessage, UIMessageChunk } from "ai"
import { createSseToJsonTransformStream } from "../utils/utils"

export interface ChatAppEndpoints {
  streamChatConversation: (
    chat: ChatConversationRequest,
    workspaceId: string
  ) => Promise<AsyncIterable<UIMessage<AgentMessageMetadata>>>
  deleteChatConversation: (
    chatConversationId: string,
    chatAppId: string,
    agentId?: string
  ) => Promise<void>
  fetchChatConversation: (
    chatAppId: string,
    chatConversationId: string,
    agentId?: string
  ) => Promise<ChatConversation>
  fetchChatAppAgents: (chatAppId: string) => Promise<FetchChatAppAgentsResponse>
  fetchChatHistory: (
    chatAppId: string,
    agentId?: string
  ) => Promise<FetchAgentHistoryResponse>
  fetchChatApp: (workspaceId?: string) => Promise<ChatApp | null>
  fetchChatAppAgentFileUrl: (
    chatAppId: string,
    agentId: string,
    fileId: string,
    operationId: string
  ) => Promise<FetchAgentFileUrlResponse>
  createChatConversation: (
    chat: CreateChatConversationRequest,
    workspaceId?: string
  ) => Promise<ChatConversation>
}

const getBrowserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return undefined
  }
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

const withAgentIdQuery = (url: string, agentId?: string) => {
  if (!agentId) {
    return url
  }

  const query = new URLSearchParams({ agentId })
  return `${url}?${query.toString()}`
}

export const buildChatAppEndpoints = (
  API: BaseAPIClient
): ChatAppEndpoints => ({
  streamChatConversation: async (chat, workspaceId) => {
    if (!chat.chatAppId) {
      throw new Error("chatAppId is required to stream a chat conversation")
    }

    const body: ChatAgentRequest = {
      ...chat,
      timezone: chat.timezone ?? getBrowserTimezone(),
    }
    const conversationId = chat._id || "new"

    const response = await fetch(
      `/api/chatapps/${chat.chatAppId}/conversations/${conversationId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          [Header.WORKSPACE_ID]: workspaceId,
        },
        body: JSON.stringify(body),
        credentials: "same-origin",
      }
    )

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

  deleteChatConversation: async (
    chatConversationId: string,
    chatAppId: string,
    agentId?: string
  ) => {
    return await API.delete({
      url: withAgentIdQuery(
        `/api/chatapps/${chatAppId}/conversations/${chatConversationId}`,
        agentId
      ),
    })
  },

  fetchChatConversation: async (
    chatAppId: string,
    chatConversationId: string,
    agentId?: string
  ) => {
    return await API.get({
      url: withAgentIdQuery(
        `/api/chatapps/${chatAppId}/conversations/${chatConversationId}`,
        agentId
      ),
    })
  },

  fetchChatAppAgents: async (chatAppId: string) => {
    return await API.get({
      url: `/api/chatapps/${chatAppId}/agents`,
    })
  },

  fetchChatHistory: async (chatAppId: string, agentId?: string) => {
    return await API.get({
      url: withAgentIdQuery(
        `/api/chatapps/${chatAppId}/conversations`,
        agentId
      ),
    })
  },

  fetchChatApp: async (workspaceId?: string) => {
    const url = "/api/chatapps"
    const headers = workspaceId
      ? {
          [Header.WORKSPACE_ID]: workspaceId,
        }
      : undefined
    return await API.get({
      url,
      ...(headers && { headers }),
    })
  },

  fetchChatAppAgentFileUrl: async (
    chatAppId: string,
    agentId: string,
    fileId: string,
    operationId: string
  ) => {
    if (!operationId) {
      throw new Error("operationId is required to fetch a chat app agent file")
    }
    return await API.get<FetchAgentFileUrlResponse>({
      url: `/api/chatapps/${chatAppId}/agents/${agentId}/operations/${operationId}/files/${fileId}/url`,
    })
  },

  createChatConversation: async (
    chat: CreateChatConversationRequest,
    workspaceId?: string
  ) => {
    const resolvedWorkspaceId = workspaceId || API.getAppID()
    const { chatAppId } = chat
    if (!chatAppId) {
      throw new Error("chatAppId is required to create a chat conversation")
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (resolvedWorkspaceId) {
      headers[Header.WORKSPACE_ID] = resolvedWorkspaceId
    }

    const response = await fetch(`/api/chatapps/${chatAppId}/conversations`, {
      method: "POST",
      headers,
      credentials: "same-origin",
      body: JSON.stringify(chat),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null)
      throw new Error(
        errorBody?.message || `HTTP error! status: ${response.status}`
      )
    }

    return (await response.json()) as ChatConversation
  },
})
