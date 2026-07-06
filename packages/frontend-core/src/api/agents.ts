import {
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  CreateAgentRequest,
  CreateAgentResponse,
  DisconnectAgentSharePointSiteResponse,
  DuplicateAgentResponse,
  FetchAgentKnowledgeIndexResponse,
  FetchAgentFileUrlResponse,
  FetchAgentKnowledgeSourceEntriesResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  FetchAgentsResponse,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentTelegramChannelRequest,
  ProvisionAgentTelegramChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  SyncAgentKnowledgeSourcesRequest,
  SyncAgentKnowledgeSourcesResponse,
  ToggleAgentDeploymentRequest,
  ToggleAgentDeploymentResponse,
  ToolMetadata,
  UpdateAgentSharePointSiteRequest,
  UpdateAgentSharePointSiteResponse,
  UpdateAgentRequest,
  UpdateAgentResponse,
  CreateAgentOperationRequest,
  UpdateAgentOperationRequest,
  AgentOperationMutationResponse,
  CreateAgentSlackAppRequest,
  CreateAgentSlackAppResponse,
} from "@budibase/types"

import { BaseAPIClient } from "./types"

export interface AgentEndpoints {
  fetchTools: (aiconfigId?: string) => Promise<ToolMetadata[]>
  fetchAgents: () => Promise<FetchAgentsResponse>
  fetchAgentKnowledge: (
    agentId: string
  ) => Promise<FetchAgentKnowledgeIndexResponse>
  createAgent: (agent: CreateAgentRequest) => Promise<CreateAgentResponse>
  updateAgent: (agent: UpdateAgentRequest) => Promise<UpdateAgentResponse>
  createAgentOperation: (
    agentId: string,
    operation: CreateAgentOperationRequest
  ) => Promise<AgentOperationMutationResponse>
  updateAgentOperation: (
    agentId: string,
    operationId: string,
    operation: UpdateAgentOperationRequest
  ) => Promise<AgentOperationMutationResponse>
  deleteAgentOperation: (
    agentId: string,
    operationId: string
  ) => Promise<AgentOperationMutationResponse>
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
  downloadAgentSlackManifest: (agentId: string) => Promise<string>
  createAgentSlackApp: (
    agentId: string,
    body?: CreateAgentSlackAppRequest
  ) => Promise<CreateAgentSlackAppResponse>
  provisionAgentTelegramChannel: (
    agentId: string,
    body?: ProvisionAgentTelegramChannelRequest
  ) => Promise<ProvisionAgentTelegramChannelResponse>
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
  toggleAgentTelegramDeployment: (
    agentId: string,
    enabled: boolean
  ) => Promise<ToggleAgentDeploymentResponse>
  uploadOperationFile: (
    agentId: string,
    operationId: string,
    file: File
  ) => Promise<AgentFileUploadResponse>
  deleteOperationFile: (
    agentId: string,
    operationId: string,
    fileId: string
  ) => Promise<{ deleted: true }>
  fetchOperationFileUrl: (
    agentId: string,
    operationId: string,
    fileId: string
  ) => Promise<FetchAgentFileUrlResponse>
  fetchAgentKnowledgeSourceOptions: (
    datasourceId: string,
    authConfigId: string
  ) => Promise<FetchAgentKnowledgeSourceOptionsResponse>
  fetchOperationKnowledgeSourceAllEntries: (
    agentId: string,
    operationId: string,
    siteId: string
  ) => Promise<FetchAgentKnowledgeSourceEntriesResponse>
  connectOperationSharePointSite: (
    agentId: string,
    operationId: string,
    body: ConnectAgentSharePointSiteRequest
  ) => Promise<ConnectAgentSharePointSiteResponse>
  updateOperationSharePointSite: (
    agentId: string,
    operationId: string,
    siteId: string,
    body: UpdateAgentSharePointSiteRequest
  ) => Promise<UpdateAgentSharePointSiteResponse>
  disconnectOperationSharePointSite: (
    agentId: string,
    operationId: string,
    siteId: string
  ) => Promise<DisconnectAgentSharePointSiteResponse>
  syncOperationKnowledgeSources: (
    agentId: string,
    operationId: string,
    sourceId: string
  ) => Promise<SyncAgentKnowledgeSourcesResponse>
  resetOperationKnowledgeBaseStore: (
    agentId: string,
    operationId: string
  ) => Promise<void>
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

  fetchAgentKnowledge: async (agentId: string) => {
    return await API.get<FetchAgentKnowledgeIndexResponse>({
      url: `/api/agent/${agentId}/knowledge`,
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

  createAgentOperation: async (agentId, operation) => {
    return await API.post({
      url: `/api/agent/${agentId}/operations`,
      body: operation,
    })
  },

  updateAgentOperation: async (agentId, operationId, operation) => {
    return await API.put({
      url: `/api/agent/${agentId}/operations/${operationId}`,
      body: operation,
    })
  },

  deleteAgentOperation: async (agentId, operationId) => {
    return await API.delete({
      url: `/api/agent/${agentId}/operations/${operationId}`,
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

  downloadAgentSlackManifest: async (agentId: string) => {
    return await API.get<string>({
      url: `/api/agent/${agentId}/slack/manifest`,
      parseResponse: async response => await response.text(),
    })
  },

  createAgentSlackApp: async (agentId: string, body) => {
    return await API.post<
      CreateAgentSlackAppRequest | undefined,
      CreateAgentSlackAppResponse
    >({
      url: `/api/agent/${agentId}/slack/app/create`,
      body,
    })
  },

  provisionAgentTelegramChannel: async (agentId: string, body) => {
    return await API.post<
      ProvisionAgentTelegramChannelRequest | undefined,
      ProvisionAgentTelegramChannelResponse
    >({
      url: `/api/agent/${agentId}/telegram/provision`,
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

  toggleAgentTelegramDeployment: async (agentId: string, enabled: boolean) => {
    return await API.post<
      ToggleAgentDeploymentRequest,
      ToggleAgentDeploymentResponse
    >({
      url: `/api/agent/${agentId}/telegram/toggle`,
      body: { enabled },
    })
  },

  uploadOperationFile: async (
    agentId: string,
    operationId: string,
    file: File
  ) => {
    const formData = new FormData()
    formData.append("file", file)
    return await API.post<FormData, AgentFileUploadResponse>({
      url: `/api/agent/${agentId}/operations/${operationId}/files`,
      body: formData,
      json: false,
    })
  },

  deleteOperationFile: async (
    agentId: string,
    operationId: string,
    fileId: string
  ) => {
    return await API.delete({
      url: `/api/agent/${agentId}/operations/${operationId}/files/${fileId}`,
    })
  },

  fetchOperationFileUrl: async (
    agentId: string,
    operationId: string,
    fileId: string
  ) => {
    return await API.get<FetchAgentFileUrlResponse>({
      url: `/api/agent/${agentId}/operations/${operationId}/files/${fileId}/url`,
    })
  },

  fetchAgentKnowledgeSourceOptions: async (
    datasourceId: string,
    authConfigId: string
  ) => {
    return await API.get<FetchAgentKnowledgeSourceOptionsResponse>({
      url: `/api/knowledge-sources/${encodeURIComponent(datasourceId)}/${encodeURIComponent(authConfigId)}/options`,
    })
  },

  fetchOperationKnowledgeSourceAllEntries: async (
    agentId: string,
    operationId: string,
    siteId: string
  ) => {
    const query = new URLSearchParams({ siteId })
    return await API.get<FetchAgentKnowledgeSourceEntriesResponse>({
      url: `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/sharepoint/entries/all?${query.toString()}`,
    })
  },

  connectOperationSharePointSite: async (
    agentId: string,
    operationId: string,
    body
  ) => {
    return await API.post<
      ConnectAgentSharePointSiteRequest,
      ConnectAgentSharePointSiteResponse
    >({
      url: `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/sharepoint/sites`,
      body,
    })
  },

  updateOperationSharePointSite: async (
    agentId: string,
    operationId: string,
    siteId: string,
    body
  ) => {
    return await API.patch<
      UpdateAgentSharePointSiteRequest,
      UpdateAgentSharePointSiteResponse
    >({
      url: `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/sharepoint/sites/${encodeURIComponent(siteId)}`,
      body,
    })
  },

  disconnectOperationSharePointSite: async (
    agentId: string,
    operationId: string,
    siteId: string
  ) => {
    return await API.delete<void, DisconnectAgentSharePointSiteResponse>({
      url: `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/sharepoint/sites/${encodeURIComponent(siteId)}`,
    })
  },

  syncOperationKnowledgeSources: async (
    agentId: string,
    operationId: string,
    sourceId: string
  ) => {
    return await API.post<
      SyncAgentKnowledgeSourcesRequest | undefined,
      SyncAgentKnowledgeSourcesResponse
    >({
      url: `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/${encodeURIComponent(sourceId)}/sync`,
    })
  },

  resetOperationKnowledgeBaseStore: async (
    agentId: string,
    operationId: string
  ) => {
    await API.post({
      url: `/api/agent/${agentId}/operations/${operationId}/knowledge/store/reset`,
    })
  },
})
