import {
  ChatAgentRequest,
  ChatConversation,
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
    chat: ChatConversation,
    workspaceId: string
  ) => Promise<AsyncIterable<UIMessage>>
  deleteChatConversation: (chatConversationId: string) => Promise<void>
  fetchChatHistory: (chatAppId: string) => Promise<FetchAgentHistoryResponse>
  fetchChatApp: (
    agentId?: string,
    workspaceId?: string
  ) => Promise<ChatApp | null>
  createChatConversation: (
    chat: Pick<ChatConversation, "chatAppId" | "title">,
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

  deleteChatConversation: async (chatConversationId: string) => {
    return await API.delete({
      url: `/api/chat/conversations/${chatConversationId}`,
    })
  },

  fetchChatHistory: async (chatAppId: string) => {
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

  createChatConversation: async (
    chat: Pick<ChatConversation, "chatAppId" | "title">,
    workspaceId?: string
  ) => {
    const resolvedWorkspaceId = workspaceId || API.getAppID()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    if (resolvedWorkspaceId) {
      headers[Header.APP_ID] = resolvedWorkspaceId
    }

    const response = await fetch("/api/chat/conversations", {
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
    return await API.put({
      url: "/api/chatapp",
      body: chatApp as any,
    })
  },
})
