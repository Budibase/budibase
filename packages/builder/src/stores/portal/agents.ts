import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Agent,
  AgentFileUploadResponse,
  CreateAgentRequest,
  DisconnectAgentKnowledgeSourcesResponse,
  FetchAgentFilesResponse,
  FetchAgentKnowledgeSourceOptionsResponse,
  KnowledgeSourceOption,
  KnowledgeSourceSyncRun,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  KnowledgeBaseFileStatus,
  SetAgentKnowledgeSourcesRequest,
  SetAgentKnowledgeSourcesResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  SyncAgentKnowledgeSourcesRequest,
  SyncAgentKnowledgeSourcesResponse,
  ToolMetadata,
  UpdateAgentRequest,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { derived, get } from "svelte/store"

interface AgentStoreState {
  agents: Agent[]
  currentAgentId?: string
  tools: ToolMetadata[]
  agentsLoaded: boolean
  filesByAgentId: Record<string, KnowledgeBaseFile[]>
  knowledgeSourceOptionsByAgentId: Record<string, KnowledgeSourceOption[]>
  knowledgeSourceRunsByAgentId: Record<string, KnowledgeSourceSyncRun[]>
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
      filesByAgentId: {},
      knowledgeSourceOptionsByAgentId: {},
      knowledgeSourceRunsByAgentId: {},
    })
  }

  private setAgentFiles = (agentId: string, files: KnowledgeBaseFile[]) => {
    this.update(state => {
      state.filesByAgentId[agentId] = files
      return state
    })
  }

  private setAgentKnowledgeSourceOptions = (
    agentId: string,
    options: KnowledgeSourceOption[],
    runs: KnowledgeSourceSyncRun[]
  ) => {
    this.update(state => {
      state.knowledgeSourceOptionsByAgentId[agentId] = options
      state.knowledgeSourceRunsByAgentId[agentId] = runs
      return state
    })
  }

  private shouldPollAgentFiles = (agentId: string) => {
    const state = get(this.store)
    const files = state.filesByAgentId[agentId] || []
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

  setAgentKnowledgeSources = async (
    agentId: string,
    body: SetAgentKnowledgeSourcesRequest
  ): Promise<SetAgentKnowledgeSourcesResponse> => {
    const response = await API.setAgentKnowledgeSources(agentId, body)
    this.setAgentKnowledgeSourceOptions(
      agentId,
      response.options,
      response.runs
    )
    return response
  }

  disconnectAgentKnowledgeSources = async (
    agentId: string
  ): Promise<DisconnectAgentKnowledgeSourcesResponse> =>
    await API.disconnectAgentKnowledgeSources(agentId)

  syncAgentKnowledgeSources = async (
    agentId: string,
    body?: SyncAgentKnowledgeSourcesRequest
  ): Promise<SyncAgentKnowledgeSourcesResponse> =>
    await API.syncAgentKnowledgeSources(agentId, body)
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state =>
  state.agents.find(a => a._id === state.currentAgentId)
)
