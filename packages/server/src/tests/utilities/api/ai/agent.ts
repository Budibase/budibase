import {
  Agent,
  CreateAgentRequest,
  CreateAgentResponse,
  ProvisionAgentTeamsChannelRequest,
  ProvisionAgentTeamsChannelResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
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

  provisionTeamsChannel = async (
    agentId: string,
    body?: ProvisionAgentTeamsChannelRequest,
    expectations?: Expectations
  ): Promise<ProvisionAgentTeamsChannelResponse> => {
    return await this._post<ProvisionAgentTeamsChannelResponse>(
      `/api/agent/${agentId}/teams/provision`,
      {
        body,
        expectations,
      }
    )
  }
}
