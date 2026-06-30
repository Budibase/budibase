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
  KnowledgeBaseFileStatus,
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
  UpdateAgentOperationRequest,
  CreateAgentOperationRequest,
  type KnowledgeBaseFile,
} from "@budibase/types"
import { derived, get } from "svelte/store"
import { createOperationKnowledgePollingController } from "./operationKnowledgePolling"

const KNOWLEDGE_POLL_INTERVAL_MS = 1000
const BYTES_IN_MB = 1024 * 1024
const MAX_OPERATION_KNOWLEDGE_FILE_SIZE_BYTES = 100 * BYTES_IN_MB

export const MAX_OPERATION_KNOWLEDGE_FILE_SIZE_LABEL = "100MB"

export interface OperationKnowledgePendingUpload {
  tempId: string
  filename: string
  size?: number
  mimetype?: string
  createdAt: string
}

export interface OperationKnowledgeUploadState {
  pendingUploads: OperationKnowledgePendingUpload[]
  uploading: boolean
  progress: string
}

export interface OperationKnowledgeUploadResult {
  successfulUploads: number
  failedUploads: string[]
  oversizedUploads: string[]
  totalSelected: number
}

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
  knowledgeUploadByOperation: Record<string, OperationKnowledgeUploadState>
  knowledgeLoadingByOperation: Record<string, boolean>
}

const getOperationKnowledgeCacheKey = (agentId: string, operationId: string) =>
  `${agentId}:${operationId}`

const emptyUploadState = (): OperationKnowledgeUploadState => ({
  pendingUploads: [],
  uploading: false,
  progress: "",
})

export class AgentsStore extends BudiStore<AgentStoreState> {
  private knowledgeRefreshByAgent = new Map<string, Promise<void>>()
  private knowledgeLoadByKey = new Map<string, Promise<void>>()
  private knowledgePolling = createOperationKnowledgePollingController({
    intervalMs: KNOWLEDGE_POLL_INTERVAL_MS,
    onPoll: agentId => this.refreshOperationKnowledge(agentId),
    onError: error => {
      console.error("Failed to poll knowledge files", error)
    },
  })

  constructor() {
    super({
      agents: [],
      tools: [],
      agentsLoaded: false,
      knowledgeByOperation: {},
      knowledgeUploadByOperation: {},
      knowledgeLoadingByOperation: {},
    })
  }

  private getAgentOrThrow = (agentId: string) => {
    const agent = get(this.store).agents.find(
      candidate => candidate._id === agentId
    )
    if (!agent) {
      throw new Error("Agent not found")
    }
    return agent
  }

  private updateOperation = async (
    agentId: string,
    operationId: string,
    updater: (operation: AgentOperation) => AgentOperation
  ) => {
    const operation = this.getAgentOperation(agentId, operationId)
    if (!operation) {
      throw new Error("Operation not found")
    }
    const updated = updater(operation)
    return await this.updateAgentOperation(agentId, operationId, {
      name: updated.name,
      live: updated.live,
      promptInstructions: updated.promptInstructions,
      enabledTools: updated.enabledTools,
      allowKnowledgeSourceDownload: updated.allowKnowledgeSourceDownload,
    })
  }

  private replaceAgentInStore = (updated: Agent) => {
    this.update(state => {
      const index = state.agents.findIndex(a => a._id === updated._id)
      if (index !== -1) {
        state.agents[index] = updated
      }
      return state
    })
    return updated
  }

  private setKnowledgeLoading = (cacheKey: string, loading: boolean) => {
    this.update(state => {
      state.knowledgeLoadingByOperation[cacheKey] = loading
      return state
    })
  }

  private setOperationUploadState = (
    cacheKey: string,
    updater: (
      current: OperationKnowledgeUploadState
    ) => OperationKnowledgeUploadState
  ) => {
    this.update(state => {
      const current =
        state.knowledgeUploadByOperation[cacheKey] || emptyUploadState()
      state.knowledgeUploadByOperation[cacheKey] = updater(current)
      return state
    })
  }

  private syncKnowledgePollingForAgent = (agentId: string) => {
    const needsPolling = Object.entries(get(this.store).knowledgeByOperation)
      .filter(([cacheKey]) => cacheKey.startsWith(`${agentId}:`))
      .some(([, knowledge]) => {
        const hasProcessingFiles = knowledge.files.some(
          file => file.status === KnowledgeBaseFileStatus.PROCESSING
        )
        const hasUnsyncedSharePointSites = knowledge.sharePointSources.some(
          source => !source.lastRunAt
        )
        return hasProcessingFiles || hasUnsyncedSharePointSites
      })

    this.knowledgePolling.setContinuous(agentId, needsPolling)
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

  updateAgent = async (
    agent: UpdateAgentRequest & { operations?: AgentOperation[] }
  ) => {
    const { operations: _operations, ...agentUpdate } = agent
    const updated = await API.updateAgent(agentUpdate)
    return this.replaceAgentInStore(updated)
  }

  updateAgentOperation = async (
    agentId: string,
    operationId: string,
    operation: UpdateAgentOperationRequest
  ) => {
    const updated = await API.updateAgentOperation(
      agentId,
      operationId,
      operation
    )
    return this.replaceAgentInStore(updated)
  }

  createAgentOperation = async (
    agentId: string,
    operation: CreateAgentOperationRequest
  ) => {
    const updated = await API.createAgentOperation(agentId, operation)
    return this.replaceAgentInStore(updated)
  }

  deleteAgentOperation = async (agentId: string, operationId: string) => {
    const updated = await API.deleteAgentOperation(agentId, operationId)
    return this.replaceAgentInStore(updated)
  }

  syncAgentOperations = async (
    agentId: string,
    currentOperations: AgentOperation[] | undefined,
    draftOperations: AgentOperation[]
  ) => {
    const current = currentOperations ?? []
    const draftIds = new Set(draftOperations.map(operation => operation.id))
    const currentIds = new Set(current.map(operation => operation.id))

    let latestAgent: Agent | undefined

    for (const operation of current) {
      if (!draftIds.has(operation.id)) {
        latestAgent = await this.deleteAgentOperation(agentId, operation.id)
      }
    }

    for (const operation of draftOperations) {
      const payload: UpdateAgentOperationRequest = {
        name: operation.name,
        live: operation.live,
        promptInstructions: operation.promptInstructions,
        enabledTools: operation.enabledTools,
        allowKnowledgeSourceDownload: operation.allowKnowledgeSourceDownload,
        escalation: operation.escalation,
      }

      latestAgent = currentIds.has(operation.id)
        ? await this.updateAgentOperation(agentId, operation.id, payload)
        : await this.createAgentOperation(agentId, {
            id: operation.id,
            name: operation.name,
            live: operation.live,
            promptInstructions: operation.promptInstructions,
            enabledTools: operation.enabledTools,
            allowKnowledgeSourceDownload:
              operation.allowKnowledgeSourceDownload,
            escalation: operation.escalation,
          })
    }

    return latestAgent
  }

  getAgentOperation = (
    agentId: string,
    operationId: string
  ): AgentOperation | undefined =>
    get(this.store)
      .agents.find(agent => agent._id === agentId)
      ?.operations?.find(operation => operation.id === operationId)

  updateOperationLive = async (
    agent: UpdateAgentRequest,
    operationId: string,
    live: boolean
  ) =>
    await this.updateOperation(agent._id!, operationId, operation => ({
      ...operation,
      live,
    }))

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
      for (const cacheKey of Object.keys(state.knowledgeByOperation)) {
        if (cacheKey.startsWith(`${agentId}:`)) {
          delete state.knowledgeByOperation[cacheKey]
        }
      }

      for (const [operationId, knowledge] of Object.entries(
        response.operations || {}
      )) {
        state.knowledgeByOperation[
          getOperationKnowledgeCacheKey(agentId, operationId)
        ] = knowledge
      }
      return state
    })

    this.syncKnowledgePollingForAgent(agentId)
    return response
  }

  refreshOperationKnowledge = async (agentId: string): Promise<void> => {
    const existing = this.knowledgeRefreshByAgent.get(agentId)
    if (existing) {
      return await existing
    }

    const promise = this.fetchAgentKnowledge(agentId).then(() => undefined)
    this.knowledgeRefreshByAgent.set(agentId, promise)

    try {
      await promise
    } finally {
      if (this.knowledgeRefreshByAgent.get(agentId) === promise) {
        this.knowledgeRefreshByAgent.delete(agentId)
      }
    }
  }

  ensureOperationKnowledgeLoaded = async (
    agentId: string,
    operationId: string
  ): Promise<void> => {
    const cacheKey = getOperationKnowledgeCacheKey(agentId, operationId)

    if (get(this.store).knowledgeByOperation[cacheKey]) {
      this.setKnowledgeLoading(cacheKey, false)
      this.syncKnowledgePollingForAgent(agentId)
      return
    }

    const existing = this.knowledgeLoadByKey.get(cacheKey)
    if (existing) {
      return await existing
    }

    this.setKnowledgeLoading(cacheKey, true)

    const promise = this.fetchAgentKnowledge(agentId)
      .then(() => undefined)
      .finally(() => {
        if (this.knowledgeLoadByKey.get(cacheKey) === promise) {
          this.knowledgeLoadByKey.delete(cacheKey)
        }
        this.setKnowledgeLoading(cacheKey, false)
      })

    this.knowledgeLoadByKey.set(cacheKey, promise)
    return await promise
  }

  stopOperationKnowledgePolling = () => {
    this.knowledgePolling.stop()
  }

  getOperationKnowledge = (
    agentId: string,
    operationId: string
  ): FetchAgentKnowledgeResponse | undefined =>
    get(this.store).knowledgeByOperation[
      getOperationKnowledgeCacheKey(agentId, operationId)
    ]

  isOperationKnowledgeLoading = (
    agentId: string,
    operationId: string
  ): boolean => {
    const cacheKey = getOperationKnowledgeCacheKey(agentId, operationId)
    return get(this.store).knowledgeLoadingByOperation[cacheKey] === true
  }

  getOperationUploadState = (
    agentId: string,
    operationId: string
  ): OperationKnowledgeUploadState => {
    const cacheKey = getOperationKnowledgeCacheKey(agentId, operationId)
    return (
      get(this.store).knowledgeUploadByOperation[cacheKey] || emptyUploadState()
    )
  }

  private upsertOperationKnowledgeFile = (
    agentId: string,
    operationId: string,
    file: KnowledgeBaseFile,
    pendingTempId?: string
  ) => {
    this.update(state => {
      const cacheKey = getOperationKnowledgeCacheKey(agentId, operationId)
      const existing = state.knowledgeByOperation[cacheKey]
      const files = existing?.files.some(
        existingFile => existingFile._id === file._id
      )
        ? existing.files.map(existingFile =>
            existingFile._id === file._id ? file : existingFile
          )
        : [...(existing?.files || []), file]

      state.knowledgeByOperation[cacheKey] = {
        files,
        sharePointSources: existing?.sharePointSources || [],
      }

      if (pendingTempId) {
        const uploadState =
          state.knowledgeUploadByOperation[cacheKey] || emptyUploadState()
        state.knowledgeUploadByOperation[cacheKey] = {
          ...uploadState,
          pendingUploads: uploadState.pendingUploads.filter(
            pending => pending.tempId !== pendingTempId
          ),
        }
      }

      return state
    })
    this.syncKnowledgePollingForAgent(agentId)
  }

  uploadOperationFile = async (
    agentId: string,
    operationId: string,
    file: File
  ): Promise<AgentFileUploadResponse> => {
    const response = await this.runAndRefreshAgents(() =>
      API.uploadOperationFile(agentId, operationId, file)
    )
    this.upsertOperationKnowledgeFile(agentId, operationId, response.file)
    return response
  }

  uploadOperationFiles = async (
    agentId: string,
    operationId: string,
    selectedFiles: File[]
  ): Promise<OperationKnowledgeUploadResult> => {
    const cacheKey = getOperationKnowledgeCacheKey(agentId, operationId)
    const uploads = selectedFiles.map((file, index) => ({
      file,
      tempId: `pending-upload-${Date.now()}-${index}`,
      createdAt: new Date().toISOString(),
    }))

    this.setOperationUploadState(cacheKey, current => ({
      ...current,
      pendingUploads: [
        ...uploads.map(upload => ({
          tempId: upload.tempId,
          filename: upload.file.name,
          size: upload.file.size,
          mimetype: upload.file.type || undefined,
          createdAt: upload.createdAt,
        })),
        ...current.pendingUploads,
      ],
      uploading: true,
      progress: "",
    }))

    let successfulUploads = 0
    const failedUploads: string[] = []
    const oversizedUploads: string[] = []

    try {
      for (const [index, upload] of uploads.entries()) {
        this.setOperationUploadState(cacheKey, current => ({
          ...current,
          progress: `Uploading ${index + 1}/${uploads.length}...`,
        }))

        if (upload.file.size > MAX_OPERATION_KNOWLEDGE_FILE_SIZE_BYTES) {
          oversizedUploads.push(upload.file.name)
          this.setOperationUploadState(cacheKey, current => ({
            ...current,
            pendingUploads: current.pendingUploads.filter(
              pending => pending.tempId !== upload.tempId
            ),
          }))
          continue
        }

        try {
          const response = await API.uploadOperationFile(
            agentId,
            operationId,
            upload.file
          )
          successfulUploads += 1
          this.upsertOperationKnowledgeFile(
            agentId,
            operationId,
            response.file,
            upload.tempId
          )
        } catch (error) {
          console.error("Error uploading file:", error)
          failedUploads.push(upload.file.name)
          this.setOperationUploadState(cacheKey, current => ({
            ...current,
            pendingUploads: current.pendingUploads.filter(
              pending => pending.tempId !== upload.tempId
            ),
          }))
        }
      }

      if (successfulUploads > 0) {
        await this.fetchAgents()
        await this.refreshOperationKnowledge(agentId)
      }

      return {
        successfulUploads,
        failedUploads,
        oversizedUploads,
        totalSelected: selectedFiles.length,
      }
    } finally {
      this.setOperationUploadState(cacheKey, current => ({
        ...current,
        uploading: false,
        progress: "",
      }))
    }
  }

  removeOperationKnowledgeFile = async (
    agentId: string,
    operationId: string,
    fileId: string
  ) => {
    await API.deleteOperationFile(agentId, operationId, fileId)
    await this.fetchAgents()
    await this.refreshOperationKnowledge(agentId)
  }

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
    await this.refreshOperationKnowledge(agentId)
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
    await this.fetchAgents()
    await this.refreshOperationKnowledge(agentId)
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
    await this.refreshOperationKnowledge(agentId)
    return response
  }

  syncOperationKnowledgeSources = async (
    agentId: string,
    operationId: string,
    sourceId: string
  ): Promise<SyncAgentKnowledgeSourcesResponse> => {
    const response = await API.syncOperationKnowledgeSources(
      agentId,
      operationId,
      sourceId
    )
    await this.refreshOperationKnowledge(agentId)
    return response
  }

  resetOperationKnowledgeBaseStore = async (
    agentId: string,
    operationId: string
  ): Promise<void> => {
    await API.resetOperationKnowledgeBaseStore(agentId, operationId)
    await this.refreshOperationKnowledge(agentId)
  }
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state =>
  state.agents.find(a => a._id === state.currentAgentId)
)
