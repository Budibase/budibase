import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Agent,
  AgentFile,
  CreateAgentRequest,
<<<<<<< HEAD
  ProvisionAgentTeamsChannelResponse,
  SyncAgentDiscordCommandsRequest,
=======
>>>>>>> parent of 41c62591da (naming updates)
  SyncAgentDiscordCommandsResponse,
  SyncAgentTeamsResponse,
  UpdateAgentRequest,
  ToolMetadata,
} from "@budibase/types"
import { derived } from "svelte/store"

interface AgentStoreState {
  agents: Agent[]
  currentAgentId?: string
  tools: ToolMetadata[]
  agentsLoaded: boolean
  files: AgentFile[]
}

export class AgentsStore extends BudiStore<AgentStoreState> {
  constructor() {
    super({
      agents: [],
      tools: [],
      agentsLoaded: false,
      files: [],
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
      if (agentId) {
        this.fetchFiles(agentId)
      } else {
        state.files = []
      }
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

  fetchFiles = async (agentId?: string) => {
    if (!agentId) {
      this.update(state => {
        state.files = []
        return state
      })
      return []
    }
    const { files } = await API.fetchAgentFiles(agentId)
    this.update(state => {
      if (state.currentAgentId === agentId) {
        state.files = files
      }
      return state
    })
    return files
  }

  uploadAgentFile = async (agentId: string, file: File) => {
    const { file: uploaded } = await API.uploadAgentFile(agentId, file)
    this.update(state => {
      if (state.currentAgentId === agentId) {
        state.files = [
          uploaded,
          ...state.files.filter(existing => existing._id !== uploaded._id),
        ]
      }
      return state
    })
    return uploaded
  }

  deleteAgentFile = async (agentId: string, fileId: string) => {
    await API.deleteAgentFile(agentId, fileId)
    this.update(state => {
      if (state.currentAgentId === agentId) {
        state.files = state.files.filter(file => file._id !== fileId)
      }
      return state
    })
  }

  syncDiscordCommands = async (
    agentId: string,
    body?: SyncAgentDiscordCommandsRequest
  ): Promise<SyncAgentDiscordCommandsResponse> => {
    return await API.syncAgentDiscordCommands(agentId, body)
  }

  syncTeamsChannel = async (
    agentId: string
  ): Promise<SyncAgentTeamsResponse> => {
    return await API.syncAgentTeams(agentId)
  }
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state =>
  state.agents.find(a => a._id === state.currentAgentId)
)
