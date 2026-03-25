import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { workspaceDeploymentStore } from "@/stores/builder/workspaceDeployment"
import {
  Agent,
  CreateAgentRequest,
  PublishResourceState,
  PublishStatusResource,
  ProvisionAgentSlackChannelRequest,
  ProvisionAgentSlackChannelResponse,
  ProvisionAgentMSTeamsChannelRequest,
  ProvisionAgentMSTeamsChannelResponse,
  SyncAgentDiscordCommandsRequest,
  SyncAgentDiscordCommandsResponse,
  UIAgent,
  UpdateAgentRequest,
  ToolMetadata,
} from "@budibase/types"
import { derived, get } from "svelte/store"

interface AgentStoreState {
  agents: UIAgent[]
  currentAgentId?: string
  tools: ToolMetadata[]
  agentsLoaded: boolean
}

const getAgentPublishStatus = (agent: Agent): PublishStatusResource =>
  get(workspaceDeploymentStore).agents[agent._id!] || {
    published: false,
    name: agent.name,
    state: PublishResourceState.DISABLED,
    unpublishedChanges: true,
  }

const withPublishStatus = (agent: Agent): UIAgent => ({
  ...agent,
  publishStatus: getAgentPublishStatus(agent),
})

export class AgentsStore extends BudiStore<AgentStoreState> {
  constructor() {
    super({
      agents: [],
      tools: [],
      agentsLoaded: false,
    })

    workspaceDeploymentStore.subscribe(() => {
      this.update(state => {
        state.agents = state.agents.map(withPublishStatus)
        return state
      })
    })
  }

  init = async () => {
    await this.fetchAgents()
  }

  fetchAgents = async () => {
    const { agents } = await API.fetchAgents()
    this.update(state => {
      state.agents = agents.map(withPublishStatus)
      state.agentsLoaded = true
      return state
    })
    return agents.map(withPublishStatus)
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
    workspaceDeploymentStore.setAgentUnpublishedChanges(created._id!)
    const createdWithPublishStatus = withPublishStatus(created)
    this.update(state => {
      state.agents = [...state.agents, createdWithPublishStatus]
      return state
    })
    return createdWithPublishStatus
  }

  updateAgent = async (
    agent: UpdateAgentRequest,
    opts?: {
      markUnpublishedChanges?: boolean
    }
  ) => {
    const updated = await API.updateAgent(agent)
    if (opts?.markUnpublishedChanges !== false) {
      workspaceDeploymentStore.setAgentUnpublishedChanges(updated._id!)
    }
    const updatedWithPublishStatus = withPublishStatus(updated)
    this.update(state => {
      const index = state.agents.findIndex(a => a._id === updated._id)
      if (index !== -1) {
        state.agents[index] = updatedWithPublishStatus
      }
      return state
    })
    return updatedWithPublishStatus
  }

  duplicateAgent = async (agentId: string) => {
    const duplicated = await API.duplicateAgent(agentId)
    workspaceDeploymentStore.setAgentUnpublishedChanges(duplicated._id!)
    const duplicatedWithPublishStatus = withPublishStatus(duplicated)
    this.update(state => {
      state.agents = [...state.agents, duplicatedWithPublishStatus]
      return state
    })
    return duplicatedWithPublishStatus
  }

  deleteAgent = async (agentId: string) => {
    await API.deleteAgent(agentId)
    workspaceDeploymentStore.setAgentUnpublishedChanges(agentId)
    await this.fetchAgents()
  }

  private runAndRefreshAgents = async <T>(
    action: () => Promise<T>,
    agentId?: string
  ): Promise<T> => {
    const result = await action()
    if (agentId) {
      workspaceDeploymentStore.setAgentUnpublishedChanges(agentId)
    }
    await this.fetchAgents()
    return result
  }

  syncDiscordCommands = async (
    agentId: string,
    body?: SyncAgentDiscordCommandsRequest
  ): Promise<SyncAgentDiscordCommandsResponse> =>
    await this.runAndRefreshAgents(
      () => API.syncAgentDiscordCommands(agentId, body),
      agentId
    )

  provisionMSTeamsChannel = async (
    agentId: string,
    body?: ProvisionAgentMSTeamsChannelRequest
  ): Promise<ProvisionAgentMSTeamsChannelResponse> =>
    await this.runAndRefreshAgents(
      () => API.provisionAgentMSTeamsChannel(agentId, body),
      agentId
    )

  provisionSlackChannel = async (
    agentId: string,
    body?: ProvisionAgentSlackChannelRequest
  ): Promise<ProvisionAgentSlackChannelResponse> =>
    await this.runAndRefreshAgents(
      () => API.provisionAgentSlackChannel(agentId, body),
      agentId
    )

  toggleDiscordDeployment = async (agentId: string, enabled: boolean) =>
    await this.runAndRefreshAgents(
      () => API.toggleAgentDiscordDeployment(agentId, enabled),
      agentId
    )

  toggleMSTeamsDeployment = async (agentId: string, enabled: boolean) =>
    await this.runAndRefreshAgents(
      () => API.toggleAgentMSTeamsDeployment(agentId, enabled),
      agentId
    )

  toggleSlackDeployment = async (agentId: string, enabled: boolean) =>
    await this.runAndRefreshAgents(
      () => API.toggleAgentSlackDeployment(agentId, enabled),
      agentId
    )
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state =>
  state.agents.find(a => a._id === state.currentAgentId)
)
