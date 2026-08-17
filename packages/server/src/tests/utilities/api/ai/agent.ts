import {
  Agent,
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  DisconnectAgentSharePointSiteResponse,
  CreateAgentRequest,
  CreateAgentResponse,
  CreateAgentSlackAppRequest,
  CreateAgentSlackAppResponse,
  FetchAgentKnowledgeIndexResponse,
  FetchAgentKnowledgeResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  FetchAgentFileUrlResponse,
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
  UpdateAgentRequest,
  UpdateAgentResponse,
  CreateAgentOperationRequest,
  UpdateAgentOperationRequest,
  AgentOperationMutationResponse,
  FetchAgentTestSuiteResponse,
  RunAgentTestSuiteRequest,
  RunAgentTestSuiteResponse,
  UpdateAgentTestSuiteRequest,
  UpdateAgentTestSuiteResponse,
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

  createWithOperation = async (
    agent: CreateAgentRequest,
    operation: CreateAgentOperationRequest,
    expectations?: Expectations
  ): Promise<CreateAgentResponse> => {
    const created = await this.create(agent, expectations)
    return await this.createOperation(created._id!, operation)
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

  createOperation = async (
    agentId: string,
    body: CreateAgentOperationRequest,
    expectations?: Expectations
  ): Promise<AgentOperationMutationResponse> => {
    return await this._post<AgentOperationMutationResponse>(
      `/api/agent/${agentId}/operations`,
      {
        body,
        expectations: {
          ...expectations,
          status: expectations?.status || 201,
        },
      }
    )
  }

  updateOperation = async (
    agentId: string,
    operationId: string,
    body: UpdateAgentOperationRequest,
    expectations?: Expectations
  ): Promise<AgentOperationMutationResponse> => {
    return await this._put<AgentOperationMutationResponse>(
      `/api/agent/${agentId}/operations/${operationId}`,
      {
        body,
        expectations,
      }
    )
  }

  deleteOperation = async (
    agentId: string,
    operationId: string,
    expectations?: Expectations
  ): Promise<AgentOperationMutationResponse> => {
    return await this._delete<AgentOperationMutationResponse>(
      `/api/agent/${agentId}/operations/${operationId}`,
      {
        expectations,
      }
    )
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

  downloadMSTeamsPackage = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<Buffer> => {
    const response = this._checkResponse(
      await this.request
        .get(`/api/agent/${agentId}/ms-teams/package`)
        .set(
          await this.getHeaders(undefined, {
            "x-budibase-include-stacktrace": "true",
          })
        )
        .responseType("blob"),
      expectations
    )
    return response.body as Buffer
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

  downloadSlackManifest = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<string> => {
    const response = this._checkResponse(
      await this._requestRaw("get", `/api/agent/${agentId}/slack/manifest`, {
        expectations,
      }),
      expectations
    )
    return response.text
  }

  createSlackApp = async (
    agentId: string,
    body?: CreateAgentSlackAppRequest,
    expectations?: Expectations
  ): Promise<CreateAgentSlackAppResponse> => {
    return await this._post<CreateAgentSlackAppResponse>(
      `/api/agent/${agentId}/slack/app/create`,
      {
        body,
        expectations,
      }
    )
  }

  provisionTelegramChannel = async (
    agentId: string,
    body?: ProvisionAgentTelegramChannelRequest,
    expectations?: Expectations
  ): Promise<ProvisionAgentTelegramChannelResponse> => {
    return await this._post<ProvisionAgentTelegramChannelResponse>(
      `/api/agent/${agentId}/telegram/provision`,
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

  toggleTelegramDeployment = async (
    agentId: string,
    body?: ToggleAgentDeploymentRequest | Record<string, unknown>,
    expectations?: Expectations
  ): Promise<ToggleAgentDeploymentResponse> => {
    return await this._post<ToggleAgentDeploymentResponse>(
      `/api/agent/${agentId}/telegram/toggle`,
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

  fetchTestSuite = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<FetchAgentTestSuiteResponse> => {
    return await this._get<FetchAgentTestSuiteResponse>(
      `/api/agent/${agentId}/tests`,
      {
        expectations,
      }
    )
  }

  updateTestSuite = async (
    agentId: string,
    body: UpdateAgentTestSuiteRequest,
    expectations?: Expectations
  ): Promise<UpdateAgentTestSuiteResponse> => {
    return await this._put<UpdateAgentTestSuiteResponse>(
      `/api/agent/${agentId}/tests`,
      {
        body,
        expectations,
      }
    )
  }

  runTestSuite = async (
    agentId: string,
    expectations?: Expectations,
    body?: RunAgentTestSuiteRequest
  ): Promise<RunAgentTestSuiteResponse> => {
    return await this._post<RunAgentTestSuiteResponse>(
      `/api/agent/${agentId}/tests/run`,
      {
        body,
        expectations,
      }
    )
  }

  fetchFiles = async (
    agentId: string,
    operationId: string,
    expectations?: Expectations
  ): Promise<FetchAgentKnowledgeResponse> => {
    const { operations } = await this.fetchKnowledge(agentId, expectations)
    const knowledge = operations?.[operationId]
    if (!knowledge) {
      throw new Error(`Knowledge not found for operation ${operationId}`)
    }
    return knowledge
  }

  fetchKnowledge = async (
    agentId: string,
    expectations?: Expectations
  ): Promise<FetchAgentKnowledgeIndexResponse> => {
    return await this._get<FetchAgentKnowledgeIndexResponse>(
      `/api/agent/${agentId}/knowledge`,
      {
        expectations,
      }
    )
  }

  uploadFile = async (
    agentId: string,
    operationId: string,
    file: AttachedFile,
    expectations?: Expectations
  ): Promise<AgentFileUploadResponse> => {
    return await this._post<AgentFileUploadResponse>(
      `/api/agent/${agentId}/operations/${operationId}/files`,
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
    operationId: string,
    fileId: string,
    expectations?: Expectations
  ): Promise<{ deleted: true }> => {
    return await this._delete<{ deleted: true }>(
      `/api/agent/${agentId}/operations/${operationId}/files/${fileId}`,
      {
        expectations,
      }
    )
  }

  fetchFileUrl = async (
    agentId: string,
    operationId: string,
    fileId: string,
    expectations?: Expectations
  ): Promise<FetchAgentFileUrlResponse> => {
    return await this._get<FetchAgentFileUrlResponse>(
      `/api/agent/${agentId}/operations/${operationId}/files/${fileId}/url`,
      {
        expectations,
      }
    )
  }

  fetchKnowledgeSourceOptions = async (
    datasourceId: string,
    authConfigId: string,
    expectations?: Expectations
  ): Promise<FetchAgentKnowledgeSourceOptionsResponse> => {
    return await this._get<FetchAgentKnowledgeSourceOptionsResponse>(
      `/api/knowledge-sources/${encodeURIComponent(datasourceId)}/${encodeURIComponent(authConfigId)}/options`,
      {
        expectations,
      }
    )
  }

  connectSharePointSite = async (
    agentId: string,
    operationId: string,
    body: ConnectAgentSharePointSiteRequest,
    expectations?: Expectations
  ): Promise<ConnectAgentSharePointSiteResponse> => {
    return await this._post<ConnectAgentSharePointSiteResponse>(
      `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/sharepoint/sites`,
      {
        body,
        expectations,
      }
    )
  }

  disconnectSharePointSite = async (
    agentId: string,
    operationId: string,
    siteId: string,
    expectations?: Expectations
  ): Promise<DisconnectAgentSharePointSiteResponse> => {
    return await this._delete<DisconnectAgentSharePointSiteResponse>(
      `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/sharepoint/sites/${encodeURIComponent(siteId)}`,
      {
        expectations,
      }
    )
  }

  syncKnowledgeSources = async (
    agentId: string,
    operationId: string,
    sourceId: string,
    body?: SyncAgentKnowledgeSourcesRequest,
    expectations?: Expectations
  ): Promise<SyncAgentKnowledgeSourcesResponse> => {
    return await this._post<SyncAgentKnowledgeSourcesResponse>(
      `/api/agent/${agentId}/operations/${operationId}/knowledge-sources/${encodeURIComponent(sourceId)}/sync`,
      {
        body,
        expectations,
      }
    )
  }
}
