import {
  ChatAgentRequest,
  ChatConversationRequest,
  AgentMessageMetadata,
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

export const buildChatAppEndpoints = (
  _API: BaseAPIClient
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
})
