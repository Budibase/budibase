import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Agent,
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  CreateAgentRequest,
  DisconnectAgentSharePointSiteResponse,
  FetchAgentKnowledgeResponse,
  FetchAgentKnowledgeSourceEntriesResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  SharePointKnowledgeSourceSnapshot,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
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
import { derived } from "svelte/store"

interface AgentStoreState {
  agents: Agent[]
  currentAgentId?: string
  tools: ToolMetadata[]
  agentsLoaded: boolean
  knowledgeByAgent: Record<
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
      knowledgeByAgent: {},
    })
  }

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

  fetchAgentKnowledge = async (
    agentId: string,
    operationId?: string
  ): Promise<FetchAgentKnowledgeResponse> => {
    const response = await API.fetchAgentKnowledge(agentId, operationId)

    this.update(state => {
      state.knowledgeByAgent[agentId] = response
      return state
    })
    return response
  }

  uploadAgentFile = async (
    agentId: string,
    file: File,
    operationId?: string
  ): Promise<AgentFileUploadResponse> =>
    await this.runAndRefreshAgents(() =>
      API.uploadAgentFile(agentId, file, operationId)
    )

  deleteAgentFile = async (agentId: string, fileId: string, operationId?: string) =>
    await API.deleteAgentFile(agentId, fileId, operationId)

  fetchAgentKnowledgeSourceOptions = async (
    datasourceId: string,
    authConfigId: string
  ): Promise<FetchAgentKnowledgeSourceOptionsResponse> => {
    return await API.fetchAgentKnowledgeSourceOptions(
      datasourceId,
      authConfigId
    )
  }

  fetchAgentKnowledgeSourceAllEntries = async (
    agentId: string,
    siteId: string,
    operationId?: string
  ): Promise<FetchAgentKnowledgeSourceEntriesResponse> => {
    return await API.fetchAgentKnowledgeSourceAllEntries(
      agentId,
      siteId,
      operationId
    )
  }

  connectAgentSharePointSite = async (
    agentId: string,
    body: ConnectAgentSharePointSiteRequest,
    operationId?: string
  ): Promise<ConnectAgentSharePointSiteResponse> => {
    const response = await API.connectAgentSharePointSite(
      agentId,
      body,
      operationId
    )
    await this.fetchAgents()
    await this.fetchAgentKnowledge(agentId, operationId)
    return response
  }

  updateAgentSharePointSite = async (
    agentId: string,
    siteId: string,
    body: UpdateAgentSharePointSiteRequest,
    operationId?: string
  ): Promise<UpdateAgentSharePointSiteResponse> => {
    return await API.updateAgentSharePointSite(
      agentId,
      siteId,
      body,
      operationId
    )
  }

  applyAgentSharePointSiteFilters = async (
    agentId: string,
    siteId: string,
    body: UpdateAgentSharePointSiteRequest,
    operationId?: string
  ): Promise<UpdateAgentSharePointSiteResponse> => {
    const response = await this.updateAgentSharePointSite(
      agentId,
      siteId,
      body,
      operationId
    )
    await this.fetchAgentKnowledge(agentId, operationId)
    await this.fetchAgents()
    return response
  }

  disconnectAgentSharePointSite = async (
    agentId: string,
    siteId: string,
    operationId?: string
  ): Promise<DisconnectAgentSharePointSiteResponse> => {
    const response = await API.disconnectAgentSharePointSite(
      agentId,
      siteId,
      operationId
    )
    await this.fetchAgents()
    return response
  }

  syncAgentKnowledgeSources = async (
    agentId: string,
    sourceId: string,
    operationId?: string
  ): Promise<SyncAgentKnowledgeSourcesResponse> =>
    await API.syncAgentKnowledgeSources(agentId, sourceId, operationId)
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state =>
  state.agents.find(a => a._id === state.currentAgentId)
)
