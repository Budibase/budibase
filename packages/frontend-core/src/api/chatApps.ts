import {
  ChatAgentRequest,
  ChatConversation,
  ChatConversationRequest,
  CreateChatConversationRequest,
  ChatApp,
  FetchAgentHistoryResponse,
  UpdateChatAppRequest,
} from "@budibase/types"
import { Header } from "@budibase/shared-core"
import { BaseAPIClient } from "./types"
import { readUIMessageStream, UIMessage, UIMessageChunk } from "ai"
import { createSseToJsonTransformStream } from "../utils/utils"

export interface ChatAppEndpoints {
  streamChatConversation: (
    chat: ChatConversationRequest,
    workspaceId: string
  ) => Promise<AsyncIterable<UIMessage>>
  deleteChatConversation: (
    chatConversationId: string,
    chatAppId: string
  ) => Promise<void>
  fetchChatConversation: (
    chatAppId: string,
    chatConversationId: string
  ) => Promise<ChatConversation>
  fetchChatHistory: (chatAppId: string) => Promise<FetchAgentHistoryResponse>
  fetchChatApp: (workspaceId?: string) => Promise<ChatApp | null>
  setChatAppAgent: (chatAppId: string, agentId: string) => Promise<ChatApp>
  createChatConversation: (
    chat: CreateChatConversationRequest,
    workspaceId?: string
  ) => Promise<ChatConversation>
  updateChatApp: (chatApp: UpdateChatAppRequest) => Promise<ChatApp>
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

export const buildChatAppEndpoints = (
  API: BaseAPIClient
): ChatAppEndpoints => ({
  streamChatConversation: async (chat, workspaceId) => {
    if (!chat.chatAppId) {
      throw new Error("chatAppId is required to stream a chat conversation")
    }

    const body: ChatAgentRequest = chat
    const conversationId = chat._id || "new"

    const response = await fetch(
      `/api/chatapps/${chat.chatAppId}/conversations/${conversationId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          [Header.APP_ID]: workspaceId,
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
    chatAppId: string
  ) => {
    return await API.delete({
      url: `/api/chatapps/${chatAppId}/conversations/${chatConversationId}`,
    })
  },

  fetchChatConversation: async (
    chatAppId: string,
    chatConversationId: string
  ) => {
    return await API.get({
      url: `/api/chatapps/${chatAppId}/conversations/${chatConversationId}`,
    })
  },

  fetchChatHistory: async (chatAppId: string) => {
    return await API.get({
      url: `/api/chatapps/${chatAppId}/conversations`,
    })
  },

  fetchChatApp: async (workspaceId?: string) => {
    const url = "/api/chatapps"
    const headers = workspaceId
      ? {
          [Header.APP_ID]: workspaceId,
        }
      : undefined
    return await API.get({
      url,
      ...(headers && { headers }),
    })
  },

  setChatAppAgent: async (chatAppId: string, agentId: string) => {
    if (!chatAppId) {
      throw new Error("chatAppId is required to set chat app agent")
    }
    if (!agentId) {
      throw new Error("agentId is required to set chat app agent")
    }
    return await API.post({
      url: `/api/chatapps/${chatAppId}/agent`,
      body: { agentId } as any,
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
      headers[Header.APP_ID] = resolvedWorkspaceId
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

  updateChatApp: async (chatApp: UpdateChatAppRequest) => {
    if (!chatApp._id) {
      throw new Error("chatAppId is required to update a chat app")
    }
    return await API.put({
      url: `/api/chatapps/${chatApp._id}`,
      body: chatApp as any,
    })
  },
})
