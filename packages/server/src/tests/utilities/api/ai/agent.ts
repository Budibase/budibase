import {
  Agent,
  AgentFileUploadResponse,
  DisconnectAgentKnowledgeSourcesResponse,
  CreateAgentRequest,
  CreateAgentResponse,
  FetchAgentFilesResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  SetAgentKnowledgeSourcesRequest,
  SetAgentKnowledgeSourcesResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  SyncAgentKnowledgeSourcesRequest,
  SyncAgentKnowledgeSourcesResponse,
  ToggleAgentDeploymentRequest,
  ToggleAgentDeploymentResponse,
  UpdateAgentRequest,
  UpdateAgentResponse,
} from "@budibase/types"
import { AttachedFile, Expectations, TestAPI } from "../base"

export class AgentAPI extends TestAPI {
  fetch = async (expectations?: Expectations): Promise<{ agents: Agent[] }> => {
    return await this._get<{ agents: Agent[] }>(`/api/agent`, {
      expectations,
    })
  }

  create = async (
    body: CreateAgentRequest,
    expectations?: Expectations
  ): Promise<CreateAgentResponse> => {
    return await this._post<CreateAgentResponse>(`/api/agent`, {
      body,
      expectations: {
        ...expectations,
        status: expectations?.status || 201,
      },
    })
  }

  update = async (
    body: UpdateAgentRequest,
    expectations?: Expectations
  ): Promise<UpdateAgentResponse> => {
    return await this._put<UpdateAgentResponse>(`/api/agent`, {
      body,
      expectations,
    })
  }

  remove = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(`/api/agent/${agentId}`, {
      expectations,
    })
  }

  syncDiscordCommands = async (
    agentId: string,
    body?: SyncAgentDiscordCommandsRequest,
    expectations?: Expectations
  ): Promise<SyncAgentDiscordCommandsResponse> => {
    return await this._post<SyncAgentDiscordCommandsResponse>(
      `/api/agent/${agentId}/discord/sync`,
      {
        body,
        expectations,
      }
    )
  }

  provisionMSTeamsChannel = async (
    agentId: string,
    body?: ProvisionAgentMSTeamsChannelRequest,
    expectations?: Expectations
  ): Promise<ProvisionAgentMSTeamsChannelResponse> => {
    return await this._post<ProvisionAgentMSTeamsChannelResponse>(
      `/api/agent/${agentId}/ms-teams/provision`,
      {
        body,
        expectations,
      }
    )
  }

  provisionSlackChannel = async (
    agentId: string,
    body?: ProvisionAgentSlackChannelRequest,
    expectations?: Expectations
  ): Promise<ProvisionAgentSlackChannelResponse> => {
    return await this._post<ProvisionAgentSlackChannelResponse>(
      `/api/agent/${agentId}/slack/provision`,
      {
        body,
        expectations,
      }
    )
  }

  toggleDiscordDeployment = async (
    agentId: string,
    body?: ToggleAgentDeploymentRequest | Record<string, unknown>,
    expectations?: Expectations
  ): Promise<ToggleAgentDeploymentResponse> => {
    return await this._post<ToggleAgentDeploymentResponse>(
      `/api/agent/${agentId}/discord/toggle`,
      {
        body,
        expectations,
      }
    )
  }

  duplicate = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<CreateAgentResponse> => {
    return await this._post<CreateAgentResponse>(
      `/api/agent/${agentId}/duplicate`,
      {
        expectations: {
          ...expectations,
          status: expectations?.status || 201,
        },
      }
    )
  }

  fetchFiles = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<FetchAgentFilesResponse> => {
    return await this._get<FetchAgentFilesResponse>(
      `/api/agent/${agentId}/files`,
      {
        expectations,
      }
    )
  }

  uploadFile = async (
    agentId: string,
    file: AttachedFile,
    expectations?: Expectations
  ): Promise<AgentFileUploadResponse> => {
    return await this._post<AgentFileUploadResponse>(
      `/api/agent/${agentId}/files`,
      {
        files: { file },
        expectations: {
          ...expectations,
          status: expectations?.status || 201,
        },
      }
    )
  }

  removeFile = async (
    agentId: string,
    fileId: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(
      `/api/agent/${agentId}/files/${fileId}`,
      {
        expectations,
      }
    )
  }

  fetchKnowledgeSourceOptions = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<FetchAgentKnowledgeSourceOptionsResponse> => {
    return await this._get<FetchAgentKnowledgeSourceOptionsResponse>(
      `/api/agent/${agentId}/knowledge-sources/options`,
      {
        expectations,
      }
    )
  }

  setKnowledgeSources = async (
    agentId: string,
    body: SetAgentKnowledgeSourcesRequest,
    expectations?: Expectations
  ): Promise<SetAgentKnowledgeSourcesResponse> => {
    return await this._put<SetAgentKnowledgeSourcesResponse>(
      `/api/agent/${agentId}/knowledge-sources`,
      {
        body,
        expectations,
      }
    )
  }

  disconnectKnowledgeSources = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<DisconnectAgentKnowledgeSourcesResponse> => {
    return await this._delete<DisconnectAgentKnowledgeSourcesResponse>(
      `/api/agent/${agentId}/knowledge-sources`,
      {
        expectations,
      }
    )
  }

  syncKnowledgeSources = async (
    agentId: string,
    body?: SyncAgentKnowledgeSourcesRequest,
    expectations?: Expectations
  ): Promise<SyncAgentKnowledgeSourcesResponse> => {
    return await this._post<SyncAgentKnowledgeSourcesResponse>(
      `/api/agent/${agentId}/knowledge-sources/sync`,
      {
        body,
        expectations,
      }
    )
  }
}
