import {
  Agent,
  CreateAgentRequest,
  CreateAgentResponse,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  ToggleAgentDeploymentRequest,
  ToggleAgentDeploymentResponse,
  UpdateAgentRequest,
  UpdateAgentResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "../base"

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
}
