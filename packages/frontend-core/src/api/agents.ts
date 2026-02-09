import {
  AgentFileUploadResponse,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentFilesResponse,
  FetchAgentsResponse,
  SyncAgentDiscordCommandsResponse,
  ToolMetadata,
  UpdateAgentRequest,
  UpdateAgentResponse,
} from "@budibase/types"

import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  fetchTools: (aiconfigId?: string) => Promise<ToolMetadata[]>
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
  syncAgentDiscordCommands: (
    agentId: string
  ) => Promise<SyncAgentDiscordCommandsResponse>
}

export const buildAgentEndpoints = (API: BaseAPIClient): AgentEndpoints => ({
  fetchTools: async (aiconfigId?: string) => {
    const query = aiconfigId
      ? `?aiconfigId=${encodeURIComponent(aiconfigId)}`
      : ""
    return await API.get({
      url: `/api/agent/tools${query}`,
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

  syncAgentDiscordCommands: async (agentId: string) => {
    return await API.post<null, SyncAgentDiscordCommandsResponse>({
      url: `/api/agent/${agentId}/discord/sync`,
    })
  },
})
