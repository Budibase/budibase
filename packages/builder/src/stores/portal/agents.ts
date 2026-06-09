import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Agent,
  AgentOperation,
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  CreateAgentRequest,
  DisconnectAgentSharePointSiteResponse,
  FetchAgentKnowledgeIndexResponse,
  FetchAgentKnowledgeResponse,
  FetchAgentKnowledgeSourceEntriesResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  SharePointKnowledgeSourceSnapshot,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentTelegramChannelRequest,
  ProvisionAgentTelegramChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  SyncAgentKnowledgeSourcesResponse,
  ToolMetadata,
  UpdateAgentSharePointSiteRequest,
  UpdateAgentSharePointSiteResponse,
  UpdateAgentRequest,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { derived, get } from "svelte/store"

interface AgentStoreState {
  agents: Agent[]
  currentAgentId?: string
  tools: ToolMetadata[]
  agentsLoaded: boolean
  knowledgeByOperation: Record<
    string,
    {
      files: KnowledgeBaseFile[]
      sharePointSources: SharePointKnowledgeSourceSnapshot[]
    }
  >
}

export class AgentsStore extends BudiStore<AgentStoreState> {
  constructor() {
    super({
      agents: [],
      tools: [],
      agentsLoaded: false,
      knowledgeByOperation: {},
    })
  }

  private getKnowledgeCacheKey = (agentId: string, operationId: string) =>
    `${agentId}:${operationId}`

  init = async () => {
    await this.fetchAgents()
  }

  fetchAgents = async () => {
    const { agents } = await API.fetchAgents()
    this.update(state => {
      state.agents = agents
      state.agentsLoaded = true
      return state
    })
    return agents
  }

  selectAgent = async (agentId: string | undefined) => {
    if (!agentId) {
      this.update(state => {
        state.currentAgentId = undefined
        return state
      })
      return
    }

    this.update(state => {
      state.currentAgentId = agentId
      return state
    })
  }

  fetchTools = async (aiconfigId?: string) => {
    const tools = await API.fetchTools(aiconfigId)
    this.update(state => {
      state.tools = tools
      return state
    })
    return tools
  }

  createAgent = async (agent: CreateAgentRequest) => {
    const created = await API.createAgent(agent)
    this.update(state => {
      state.agents = [...state.agents, created]
      return state
    })
    return created
  }

  updateAgent = async (agent: UpdateAgentRequest) => {
    const updated = await API.updateAgent(agent)
    this.update(state => {
      const index = state.agents.findIndex(a => a._id === updated._id)
      if (index !== -1) {
        state.agents[index] = updated
      }
      return state
    })
    return updated
  }

  updateOperationLive = async (
    agent: UpdateAgentRequest,
    operationId: string,
    live: boolean
  ) => {
    const operations =
      agent.operations?.map((operation: AgentOperation) =>
        operation.id === operationId ? { ...operation, live } : operation
      ) || []

    return await this.updateAgent({
      ...agent,
      operations,
    })
  }

  duplicateAgent = async (agentId: string) => {
    const duplicated = await API.duplicateAgent(agentId)
    this.update(state => {
      state.agents = [...state.agents, duplicated]
      return state
    })
    return duplicated
  }

  deleteAgent = async (agentId: string) => {
    await API.deleteAgent(agentId)
    await this.fetchAgents()
  }

  private runAndRefreshAgents = async <T>(
    action: () => Promise<T>
  ): Promise<T> => {
    const result = await action()
    await this.fetchAgents()
    return result
  }

  syncDiscordCommands = async (
    agentId: string,
    body?: SyncAgentDiscordCommandsRequest
  ): Promise<SyncAgentDiscordCommandsResponse> =>
    await this.runAndRefreshAgents(() =>
      API.syncAgentDiscordCommands(agentId, body)
    )

  provisionMSTeamsChannel = async (
    agentId: string,
    body?: ProvisionAgentMSTeamsChannelRequest
  ): Promise<ProvisionAgentMSTeamsChannelResponse> =>
    await this.runAndRefreshAgents(() =>
      API.provisionAgentMSTeamsChannel(agentId, body)
    )

  provisionSlackChannel = async (
    agentId: string,
    body?: ProvisionAgentSlackChannelRequest
  ): Promise<ProvisionAgentSlackChannelResponse> =>
    await this.runAndRefreshAgents(() =>
      API.provisionAgentSlackChannel(agentId, body)
    )

  provisionTelegramChannel = async (
    agentId: string,
    body?: ProvisionAgentTelegramChannelRequest
  ): Promise<ProvisionAgentTelegramChannelResponse> =>
    await this.runAndRefreshAgents(() =>
      API.provisionAgentTelegramChannel(agentId, body)
    )

  toggleDiscordDeployment = async (agentId: string, enabled: boolean) =>
    await this.runAndRefreshAgents(() =>
      API.toggleAgentDiscordDeployment(agentId, enabled)
    )

  toggleMSTeamsDeployment = async (agentId: string, enabled: boolean) =>
    await this.runAndRefreshAgents(() =>
      API.toggleAgentMSTeamsDeployment(agentId, enabled)
    )

  toggleSlackDeployment = async (agentId: string, enabled: boolean) =>
    await this.runAndRefreshAgents(() =>
      API.toggleAgentSlackDeployment(agentId, enabled)
    )

  toggleTelegramDeployment = async (agentId: string, enabled: boolean) =>
    await this.runAndRefreshAgents(() =>
      API.toggleAgentTelegramDeployment(agentId, enabled)
    )

  fetchAgentKnowledge = async (
    agentId: string
  ): Promise<FetchAgentKnowledgeIndexResponse> => {
    const response = await API.fetchAgentKnowledge(agentId)

    this.update(state => {
      for (const [operationId, knowledge] of Object.entries(
        response.operations || {}
      )) {
        state.knowledgeByOperation[
          this.getKnowledgeCacheKey(agentId, operationId)
        ] = knowledge
      }
      return state
    })

    return response
  }

  getOperationKnowledge = (
    agentId: string,
    operationId: string
  ): FetchAgentKnowledgeResponse | undefined =>
    get(this.store).knowledgeByOperation[
      this.getKnowledgeCacheKey(agentId, operationId)
    ]

  uploadOperationFile = async (
    agentId: string,
    operationId: string,
    file: File
  ): Promise<AgentFileUploadResponse> => {
    const response = await this.runAndRefreshAgents(() =>
      API.uploadOperationFile(agentId, operationId, file)
    )
    this.update(state => {
      const cacheKey = this.getKnowledgeCacheKey(agentId, operationId)
      const existing = state.knowledgeByOperation[cacheKey]
      const files = existing?.files.some(
        existingFile => existingFile._id === response.file._id
      )
        ? existing.files.map(existingFile =>
            existingFile._id === response.file._id
              ? response.file
              : existingFile
          )
        : [...(existing?.files || []), response.file]

      state.knowledgeByOperation[cacheKey] = {
        files,
        sharePointSources: existing?.sharePointSources || [],
      }
      return state
    })
    return response
  }

  deleteOperationFile = async (
    agentId: string,
    operationId: string,
    fileId: string
  ) => await API.deleteOperationFile(agentId, operationId, fileId)

  fetchAgentKnowledgeSourceOptions = async (
    datasourceId: string,
    authConfigId: string
  ): Promise<FetchAgentKnowledgeSourceOptionsResponse> => {
    return await API.fetchAgentKnowledgeSourceOptions(
      datasourceId,
      authConfigId
    )
  }

  fetchOperationKnowledgeSourceAllEntries = async (
    agentId: string,
    operationId: string,
    siteId: string
  ): Promise<FetchAgentKnowledgeSourceEntriesResponse> => {
    return await API.fetchOperationKnowledgeSourceAllEntries(
      agentId,
      operationId,
      siteId
    )
  }

  connectOperationSharePointSite = async (
    agentId: string,
    operationId: string,
    body: ConnectAgentSharePointSiteRequest
  ): Promise<ConnectAgentSharePointSiteResponse> => {
    const response = await API.connectOperationSharePointSite(
      agentId,
      operationId,
      body
    )
    await this.fetchAgents()
    await this.fetchAgentKnowledge(agentId)
    return response
  }

  updateOperationSharePointSite = async (
    agentId: string,
    operationId: string,
    siteId: string,
    body: UpdateAgentSharePointSiteRequest
  ): Promise<UpdateAgentSharePointSiteResponse> => {
    return await API.updateOperationSharePointSite(
      agentId,
      operationId,
      siteId,
      body
    )
  }

  applyOperationSharePointSiteFilters = async (
    agentId: string,
    operationId: string,
    siteId: string,
    body: UpdateAgentSharePointSiteRequest
  ): Promise<UpdateAgentSharePointSiteResponse> => {
    const response = await this.updateOperationSharePointSite(
      agentId,
      operationId,
      siteId,
      body
    )
    await this.fetchAgentKnowledge(agentId)
    await this.fetchAgents()
    return response
  }

  disconnectOperationSharePointSite = async (
    agentId: string,
    operationId: string,
    siteId: string
  ): Promise<DisconnectAgentSharePointSiteResponse> => {
    const response = await API.disconnectOperationSharePointSite(
      agentId,
      operationId,
      siteId
    )
    await this.fetchAgents()
    return response
  }

  syncOperationKnowledgeSources = async (
    agentId: string,
    operationId: string,
    sourceId: string
  ): Promise<SyncAgentKnowledgeSourcesResponse> =>
    await API.syncOperationKnowledgeSources(agentId, operationId, sourceId)

  resetOperationKnowledgeBaseStore = async (
    agentId: string,
    operationId: string
  ): Promise<void> => {
    await API.resetOperationKnowledgeBaseStore(agentId, operationId)
    await this.fetchAgentKnowledge(agentId)
  }
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state =>
  state.agents.find(a => a._id === state.currentAgentId)
)
