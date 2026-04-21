import {
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  CreateAgentRequest,
  CreateAgentResponse,
  DisconnectAgentSharePointSiteResponse,
  DuplicateAgentResponse,
  FetchAgentKnowledgeResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  FetchAgentsResponse,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  SyncAgentKnowledgeSourcesRequest,
  SyncAgentKnowledgeSourcesResponse,
  ToggleAgentDeploymentRequest,
  ToggleAgentDeploymentResponse,
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
  duplicateAgent: (agentId: string) => Promise<DuplicateAgentResponse>
  deleteAgent: (agentId: string) => Promise<{ deleted: true }>
  syncAgentDiscordCommands: (
    agentId: string,
    body?: SyncAgentDiscordCommandsRequest
  ) => Promise<SyncAgentDiscordCommandsResponse>
  provisionAgentMSTeamsChannel: (
    agentId: string,
    body?: ProvisionAgentMSTeamsChannelRequest
  ) => Promise<ProvisionAgentMSTeamsChannelResponse>
  provisionAgentSlackChannel: (
    agentId: string,
    body?: ProvisionAgentSlackChannelRequest
  ) => Promise<ProvisionAgentSlackChannelResponse>
  toggleAgentDiscordDeployment: (
    agentId: string,
    enabled: boolean
  ) => Promise<ToggleAgentDeploymentResponse>
  toggleAgentMSTeamsDeployment: (
    agentId: string,
    enabled: boolean
  ) => Promise<ToggleAgentDeploymentResponse>
  toggleAgentSlackDeployment: (
    agentId: string,
    enabled: boolean
  ) => Promise<ToggleAgentDeploymentResponse>
  fetchAgentKnowledge: (agentId: string) => Promise<FetchAgentKnowledgeResponse>
  uploadAgentFile: (
    agentId: string,
    file: File
  ) => Promise<AgentFileUploadResponse>
  deleteAgentFile: (
    agentId: string,
    fileId: string
  ) => Promise<{ deleted: true }>
  fetchAgentKnowledgeSourceOptions: (
    agentId: string
  ) => Promise<FetchAgentKnowledgeSourceOptionsResponse>
  connectAgentSharePointSite: (
    agentId: string,
    body: ConnectAgentSharePointSiteRequest
  ) => Promise<ConnectAgentSharePointSiteResponse>
  disconnectAgentSharePointSite: (
    agentId: string,
    siteId: string
  ) => Promise<DisconnectAgentSharePointSiteResponse>
  syncAgentKnowledgeSources: (
    agentId: string,
    body?: SyncAgentKnowledgeSourcesRequest
  ) => Promise<SyncAgentKnowledgeSourcesResponse>
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

  duplicateAgent: async (agentId: string) => {
    return await API.post({
      url: `/api/agent/${agentId}/duplicate`,
    })
  },

  deleteAgent: async (agentId: string) => {
    return await API.delete({
      url: `/api/agent/${agentId}`,
    })
  },

  syncAgentDiscordCommands: async (agentId: string, body) => {
    return await API.post<
      SyncAgentDiscordCommandsRequest | undefined,
      SyncAgentDiscordCommandsResponse
    >({
      url: `/api/agent/${agentId}/discord/sync`,
      body,
    })
  },

  provisionAgentMSTeamsChannel: async (agentId: string, body) => {
    return await API.post<
      ProvisionAgentMSTeamsChannelRequest | undefined,
      ProvisionAgentMSTeamsChannelResponse
    >({
      url: `/api/agent/${agentId}/ms-teams/provision`,
      body,
    })
  },

  provisionAgentSlackChannel: async (agentId: string, body) => {
    return await API.post<
      ProvisionAgentSlackChannelRequest | undefined,
      ProvisionAgentSlackChannelResponse
    >({
      url: `/api/agent/${agentId}/slack/provision`,
      body,
    })
  },

  toggleAgentDiscordDeployment: async (agentId: string, enabled: boolean) => {
    return await API.post<
      ToggleAgentDeploymentRequest,
      ToggleAgentDeploymentResponse
    >({
      url: `/api/agent/${agentId}/discord/toggle`,
      body: { enabled },
    })
  },

  toggleAgentMSTeamsDeployment: async (agentId: string, enabled: boolean) => {
    return await API.post<
      ToggleAgentDeploymentRequest,
      ToggleAgentDeploymentResponse
    >({
      url: `/api/agent/${agentId}/ms-teams/toggle`,
      body: { enabled },
    })
  },

  toggleAgentSlackDeployment: async (agentId: string, enabled: boolean) => {
    return await API.post<
      ToggleAgentDeploymentRequest,
      ToggleAgentDeploymentResponse
    >({
      url: `/api/agent/${agentId}/slack/toggle`,
      body: { enabled },
    })
  },

  fetchAgentKnowledge: async (agentId: string) => {
    return await API.get<FetchAgentKnowledgeResponse>({
      url: `/api/agent/${agentId}/knowledge`,
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

  fetchAgentKnowledgeSourceOptions: async (agentId: string) => {
    return await API.get<FetchAgentKnowledgeSourceOptionsResponse>({
      url: `/api/agent/${agentId}/knowledge-sources/options`,
    })
  },

  connectAgentSharePointSite: async (agentId: string, body) => {
    return await API.post<
      ConnectAgentSharePointSiteRequest,
      ConnectAgentSharePointSiteResponse
    >({
      url: `/api/agent/${agentId}/knowledge-sources/sharepoint/sites`,
      body,
    })
  },

  disconnectAgentSharePointSite: async (agentId: string, siteId: string) => {
    return await API.delete<void, DisconnectAgentSharePointSiteResponse>({
      url: `/api/agent/${agentId}/knowledge-sources/sharepoint/sites/${encodeURIComponent(siteId)}`,
    })
  },

  syncAgentKnowledgeSources: async (
    agentId: string,
    body?: SyncAgentKnowledgeSourcesRequest
  ) => {
    return await API.post<
      SyncAgentKnowledgeSourcesRequest | undefined,
      SyncAgentKnowledgeSourcesResponse
    >({
      url: `/api/agent/${agentId}/knowledge-sources/sync`,
      body,
    })
  },
})
