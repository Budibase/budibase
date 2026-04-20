import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  AgentKnowledgeSourceType,
  Agent,
  AgentFileUploadResponse,
  ConnectAgentSharePointSiteRequest,
  ConnectAgentSharePointSiteResponse,
  CreateAgentRequest,
  DisconnectAgentSharePointSiteResponse,
  FetchAgentKnowledgeResponse,
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
  private static readonly KNOWLEDGE_SOURCE_BOOTSTRAP_POLLS = 60
  private static readonly POLLING_INTERVAL_MS = 1000

  private agentFilePolling?: {
    agentId: string
    interval: ReturnType<typeof setInterval>
    inFlight: boolean
  }
  private knowledgeSourceBootstrapPollsByAgentId: Record<string, number> = {}

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

  private setAgentKnowledge = (
    agentId: string,
    knowledge: FetchAgentKnowledgeResponse
  ) => {
    this.setAgentFiles(agentId, knowledge.files)
    this.setAgentKnowledgeSourceOptions(agentId, knowledge.options, knowledge.runs)
  }

  private addSharePointSourceToAgent = (
    agentId: string,
    site: { id: string; name?: string; webUrl?: string }
  ) => {
    this.update(state => {
      const index = state.agents.findIndex(agent => agent._id === agentId)
      if (index === -1) {
        return state
      }
      const agent = state.agents[index]
      const knowledgeSources = agent.knowledgeSources || []
      const exists = knowledgeSources.some(
        source =>
          source.type === AgentKnowledgeSourceType.SHAREPOINT &&
          source.config.site?.id === site.id
      )
      if (exists) {
        return state
      }

      const nextSource = {
        id: `sharepoint_site_${site.id.replace(/[^a-zA-Z0-9_-]/g, "_")}`,
        type: AgentKnowledgeSourceType.SHAREPOINT,
        config: {
          site,
        },
      } as NonNullable<Agent["knowledgeSources"]>[number]

      state.agents[index] = {
        ...agent,
        knowledgeSources: [...knowledgeSources, nextSource],
      }
      return state
    })
  }

  private removeSharePointSourceFromAgent = (agentId: string, siteId: string) => {
    this.update(state => {
      const index = state.agents.findIndex(agent => agent._id === agentId)
      if (index === -1) {
        return state
      }
      const agent = state.agents[index]
      const knowledgeSources = (agent.knowledgeSources || []).filter(source => {
        if (source.type !== AgentKnowledgeSourceType.SHAREPOINT) {
          return true
        }
        return source.config.site?.id !== siteId
      })
      state.agents[index] = {
        ...agent,
        knowledgeSources,
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
    const shouldPollFiles = this.shouldPollAgentFiles(agentId)
    const shouldPollKnowledgeSources =
      this.shouldPollAgentKnowledgeSources(agentId)
    if (!shouldPollFiles && !shouldPollKnowledgeSources) {
      this.stopAgentFilePolling()
      return
    }
    if (this.agentFilePolling.inFlight) {
      return
    }

    this.agentFilePolling.inFlight = true
    try {
      await this.fetchAgentKnowledge(agentId)
    } finally {
      const pendingBootstrapPolls =
        this.knowledgeSourceBootstrapPollsByAgentId[agentId] || 0
      if (pendingBootstrapPolls > 0) {
        this.knowledgeSourceBootstrapPollsByAgentId[agentId] =
          pendingBootstrapPolls - 1
      }
      if (this.agentFilePolling?.agentId === agentId) {
        const shouldContinuePolling =
          this.shouldPollAgentFiles(agentId) ||
          this.shouldPollAgentKnowledgeSources(agentId)
        if (!shouldContinuePolling) {
          this.stopAgentFilePolling()
          return
        }
        this.agentFilePolling.inFlight = false
      }
    }
  }

  private shouldPollAgentKnowledgeSources = (agentId: string) => {
    const state = get(this.store)
    const agent = state.agents.find(a => a._id === agentId)
    if (!agent) {
      return false
    }

    if ((this.knowledgeSourceBootstrapPollsByAgentId[agentId] || 0) > 0) {
      return true
    }

    const sharePointSourceIds = (agent.knowledgeSources || [])
      .filter(source => source.type === AgentKnowledgeSourceType.SHAREPOINT)
      .map(source => source.config.site?.id)
      .filter((siteId): siteId is string => !!siteId)

    if (sharePointSourceIds.length === 0) {
      delete this.knowledgeSourceBootstrapPollsByAgentId[agentId]
      return false
    }

    const runs = state.knowledgeByAgentId[agentId]?.sourceRuns || []
    const runBySourceId = new Set(runs.map(run => run.sourceId))
    return sharePointSourceIds.some(sourceId => !runBySourceId.has(sourceId))
  }

  private armKnowledgeSourceBootstrapPolling = (
    agentId: string,
    pollCount = AgentsStore.KNOWLEDGE_SOURCE_BOOTSTRAP_POLLS
  ) => {
    if (!agentId || pollCount <= 0) {
      return
    }
    this.knowledgeSourceBootstrapPollsByAgentId[agentId] = Math.max(
      this.knowledgeSourceBootstrapPollsByAgentId[agentId] || 0,
      pollCount
    )
  }

  startAgentFilePolling = (
    agentId: string,
    intervalMs = AgentsStore.POLLING_INTERVAL_MS
  ) => {
    if (!agentId) {
      return
    }
    const shouldPoll =
      this.shouldPollAgentFiles(agentId) ||
      this.shouldPollAgentKnowledgeSources(agentId)
    if (!shouldPoll) {
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

  private sanitizeUpdateAgentPayload = (
    agent: UpdateAgentRequest
  ): UpdateAgentRequest => {
    const {
      knowledgeBases: _knowledgeBases,
      knowledgeSources: _knowledgeSources,
      ...rest
    } = agent as UpdateAgentRequest & {
      knowledgeBases?: unknown
      knowledgeSources?: unknown
    }
    return rest
  }

  updateAgent = async (agent: UpdateAgentRequest) => {
    const updated = await API.updateAgent(
      this.sanitizeUpdateAgentPayload(agent)
    )
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
    agentId: string
  ): Promise<FetchAgentKnowledgeResponse> => {
    const response = await API.fetchAgentKnowledge(agentId)
    this.setAgentKnowledge(agentId, response)
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

  fetchAgentKnowledgeSourceAllEntries = async (
    agentId: string,
    siteId: string
  ): Promise<FetchAgentKnowledgeSourceEntriesResponse> => {
    return await API.fetchAgentKnowledgeSourceAllEntries(agentId, siteId)
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
    const connectedSite = response.options.find(option => option.id === body.siteId)
    this.addSharePointSourceToAgent(agentId, {
      id: body.siteId,
      name: connectedSite?.name,
      webUrl: connectedSite?.webUrl,
    })
    this.armKnowledgeSourceBootstrapPolling(agentId)
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

  applyAgentSharePointSiteFilters = async (
    agentId: string,
    siteId: string,
    body: UpdateAgentSharePointSiteRequest
  ): Promise<UpdateAgentSharePointSiteResponse> => {
    const response = await this.updateAgentSharePointSite(agentId, siteId, body)
    await this.fetchAgentKnowledge(agentId)
    return response
  }

  disconnectAgentSharePointSite = async (
    agentId: string,
    siteId: string
  ): Promise<DisconnectAgentSharePointSiteResponse> => {
    const response = await API.disconnectAgentSharePointSite(agentId, siteId)
    this.removeSharePointSourceFromAgent(agentId, siteId)
    return response
  }

  syncAgentKnowledgeSources = async (
    agentId: string,
    body?: SyncAgentKnowledgeSourcesRequest
  ): Promise<SyncAgentKnowledgeSourcesResponse> => {
    this.armKnowledgeSourceBootstrapPolling(agentId)
    return await API.syncAgentKnowledgeSources(agentId, body)
  }
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state => {
  const agent = state.agents.find(a => a._id === state.currentAgentId)
  if (!agent) {
    return agent
  }

  return { _id: agent._id!, _rev: agent._rev!, ...agent }
})
