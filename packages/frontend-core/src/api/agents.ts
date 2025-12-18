import {
  AgentChat,
  AgentFileUploadResponse,
  ChatAgentRequest,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentFilesResponse,
  FetchAgentHistoryResponse,
  FetchAgentsResponse,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
} from "@budibase/types"

import { Header } from "@budibase/shared-core"
import { BaseAPIClient } from "./types"
import { readUIMessageStream, UIMessageChunk } from "ai"
import { createSseToJsonTransformStream } from "../utils/utils"

export interface AgentEndpoints {
  agentChatStream: (
    chat: AgentChat,
    workspaceId: string
  ) => Promise<AsyncIterable<AgentChat["messages"][number]>>

  removeChat: (chatId: string) => Promise<void>
  fetchChats: (agentId: string) => Promise<FetchAgentHistoryResponse>

  fetchTools: () => Promise<ToolMetadata[]>
  fetchAgents: () => Promise<FetchAgentsResponse>
  createAgent: (agent: CreateAgentRequest) => Promise<CreateAgentResponse>
  updateAgent: (agent: UpdateAgentRequest) => Promise<UpdateAgentResponse>
  deleteAgent: (agentId: string) => Promise<{ deleted: true }>
  fetchAgentFiles: (agentId: string) => Promise<FetchAgentFilesResponse>
  uploadAgentFile: (
    agentId: string,
    file: File
  ) => Promise<AgentFileUploadResponse>
  deleteAgentFile: (
    agentId: string,
    fileId: string
  ) => Promise<{ deleted: true }>
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

  fetchChats: async (agentId: string) => {
    return await API.get({
      url: `/api/agent/${agentId}/chats`,
    })
  },

  fetchTools: async () => {
    return await API.get({
      url: `/api/agent/tools`,
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

  fetchAgentFiles: async (agentId: string) => {
    return await API.get({
      url: `/api/agent/${agentId}/files`,
    })
  },

  uploadAgentFile: async (agentId: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return await API.post<FormData, AgentFileUploadResponse>({
      url: `/api/agent/${agentId}/files`,
      body: formData,
      json: false,
    })
  },

  deleteAgentFile: async (agentId: string, fileId: string) => {
    return await API.delete({
      url: `/api/agent/${agentId}/files/${fileId}`,
    })
  },
})
