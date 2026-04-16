import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Agent,
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  CreateAgentRequest,
  DisconnectAgentSharePointSiteResponse,
  FetchAgentFilesResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  KnowledgeSourceOption,
  KnowledgeSourceSyncRun,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  KnowledgeBaseFileStatus,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  SyncAgentKnowledgeSourcesRequest,
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
  knowledgeByAgentId: Record<
    string,
    {
      files: KnowledgeBaseFile[]
      sourceOptions: KnowledgeSourceOption[]
      sourceRuns: KnowledgeSourceSyncRun[]
    }
  >
}

export class AgentsStore extends BudiStore<AgentStoreState> {
  private agentFilePolling?: {
    agentId: string
    interval: ReturnType<typeof setInterval>
    inFlight: boolean
  }

  constructor() {
    super({
      agents: [],
      tools: [],
      agentsLoaded: false,
      knowledgeByAgentId: {},
    })
  }

  private getAgentKnowledgeState = (
    state: AgentStoreState,
    agentId: string
  ) => {
    return (
      state.knowledgeByAgentId[agentId] || {
        files: [],
        sourceOptions: [],
        sourceRuns: [],
      }
    )
  }

  private setAgentFiles = (agentId: string, files: KnowledgeBaseFile[]) => {
    this.update(state => {
      const existing = this.getAgentKnowledgeState(state, agentId)
      state.knowledgeByAgentId[agentId] = {
        ...existing,
        files,
      }
      return state
    })
  }

  private setAgentKnowledgeSourceOptions = (
    agentId: string,
    options: KnowledgeSourceOption[],
    runs: KnowledgeSourceSyncRun[]
  ) => {
    this.update(state => {
      const existing = this.getAgentKnowledgeState(state, agentId)
      const byId = new Map<string, KnowledgeSourceOption>()

      for (const option of existing.sourceOptions) {
        byId.set(option.id, option)
      }
      for (const option of options) {
        const current = byId.get(option.id)
        byId.set(option.id, {
          id: option.id,
          name: option.name || current?.name,
          webUrl: option.webUrl || current?.webUrl,
        })
      }

      state.knowledgeByAgentId[agentId] = {
        ...existing,
        sourceOptions: Array.from(byId.values()),
        sourceRuns: runs,
      }
      return state
    })
  }

  private shouldPollAgentFiles = (agentId: string) => {
    const state = get(this.store)
    const files = state.knowledgeByAgentId[agentId]?.files || []
    return files.some(
      file => file.status === KnowledgeBaseFileStatus.PROCESSING
    )
  }

  private pollAgentFilesOnce = async (agentId: string) => {
    if (!this.agentFilePolling || this.agentFilePolling.agentId !== agentId) {
      return
    }
    if (this.agentFilePolling.inFlight || !this.shouldPollAgentFiles(agentId)) {
      return
    }

    this.agentFilePolling.inFlight = true
    try {
      await this.fetchAgentFiles(agentId)
    } finally {
      if (this.agentFilePolling?.agentId === agentId) {
        this.agentFilePolling.inFlight = false
      }
    }
  }

  startAgentFilePolling = (agentId: string, intervalMs = 1000) => {
    if (!agentId) {
      return
    }
    if (this.agentFilePolling?.agentId === agentId) {
      return
    }
    this.stopAgentFilePolling()

    const interval = setInterval(() => {
      this.pollAgentFilesOnce(agentId).catch(error => {
        console.error("Failed to poll agent files", error)
      })
    }, intervalMs)

    this.agentFilePolling = {
      agentId,
      interval,
      inFlight: false,
    }
  }

  stopAgentFilePolling = () => {
    if (!this.agentFilePolling) {
      return
    }
    clearInterval(this.agentFilePolling.interval)
    this.agentFilePolling = undefined
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

  fetchAgentFiles = async (
    agentId: string
  ): Promise<FetchAgentFilesResponse> => {
    const response = await API.fetchAgentFiles(agentId)
    this.setAgentFiles(agentId, response.files)
    return response
  }

  uploadAgentFile = async (
    agentId: string,
    file: File
  ): Promise<AgentFileUploadResponse> =>
    await this.runAndRefreshAgents(() => API.uploadAgentFile(agentId, file))

  deleteAgentFile = async (agentId: string, fileId: string) =>
    await API.deleteAgentFile(agentId, fileId)

  fetchAgentKnowledgeSourceOptions = async (
    agentId: string
  ): Promise<FetchAgentKnowledgeSourceOptionsResponse> => {
    const response = await API.fetchAgentKnowledgeSourceOptions(agentId)
    this.setAgentKnowledgeSourceOptions(
      agentId,
      response.options,
      response.runs
    )
    return response
  }

  connectAgentSharePointSite = async (
    agentId: string,
    body: ConnectAgentSharePointSiteRequest
  ): Promise<ConnectAgentSharePointSiteResponse> => {
    const response = await API.connectAgentSharePointSite(agentId, body)
    this.setAgentKnowledgeSourceOptions(
      agentId,
      response.options,
      response.runs
    )
    return response
  }

  updateAgentSharePointSite = async (
    agentId: string,
    siteId: string,
    body: UpdateAgentSharePointSiteRequest
  ): Promise<UpdateAgentSharePointSiteResponse> => {
    const response = await API.updateAgentSharePointSite(agentId, siteId, body)
    this.setAgentKnowledgeSourceOptions(
      agentId,
      response.options,
      response.runs
    )
    return response
  }

  disconnectAgentSharePointSite = async (
    agentId: string,
    siteId: string
  ): Promise<DisconnectAgentSharePointSiteResponse> =>
    await API.disconnectAgentSharePointSite(agentId, siteId)

  syncAgentKnowledgeSources = async (
    agentId: string,
    body?: SyncAgentKnowledgeSourcesRequest
  ): Promise<SyncAgentKnowledgeSourcesResponse> =>
    await API.syncAgentKnowledgeSources(agentId, body)
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state => {
  const agent = state.agents.find(a => a._id === state.currentAgentId)
  if (!agent) {
    return agent
  }

  return { _id: agent._id!, _rev: agent._rev!, ...agent }
})
