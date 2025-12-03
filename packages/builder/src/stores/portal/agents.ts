import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Agent,
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  CreateAgentRequest,
  CreateToolSourceRequest,
  UpdateAgentRequest,
} from "@budibase/types"
import { derived, get } from "svelte/store"

interface AgentStoreState {
  agents: Agent[]
  currentAgentId?: string
  chats: AgentChat[]
  currentChatId?: string
  toolSources: AgentToolSourceWithTools[]
  agentsLoaded: boolean
}

export class AgentsStore extends BudiStore<AgentStoreState> {
  constructor() {
    super({
      agents: [],
      chats: [],
      toolSources: [],
      agentsLoaded: false,
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

  fetchChats = async (agentId: string) => {
    if (!agentId) {
      this.update(state => {
        state.chats = []
        return state
      })
      return []
    }
    const chats = await API.fetchChats(agentId)
    this.update(state => {
      state.chats = chats
      return state
    })
    return chats
  }

  removeChat = async (chatId: string, agentId?: string) => {
    await API.removeChat(chatId)
    if (agentId) {
      await this.fetchChats(agentId)
    }
  }

  selectAgent = (agentId: string | undefined) => {
    this.update(state => {
      state.currentAgentId = agentId
      if (agentId) {
        this.fetchChats(agentId)
        this.fetchToolSources(agentId)
      } else {
        state.chats = []
        state.toolSources = []
      }
      return state
    })
  }

  fetchToolSources = async (agentId: string) => {
    if (!agentId) {
      this.update(state => {
        state.toolSources = []
        return state
      })
      return []
    }
    const toolSources = await API.fetchToolSources(agentId)
    this.update(state => {
      state.toolSources = toolSources
      return state
    })
    return toolSources
  }

  createToolSource = async (toolSource: CreateToolSourceRequest) => {
    await API.createToolSource(toolSource)
    if (toolSource.agentId) {
      await Promise.all([
        this.fetchToolSources(toolSource.agentId),
        this.fetchAgents(),
      ])
    }
    const newToolSourceWithTools = {
      ...toolSource,
      tools: [],
    } as AgentToolSourceWithTools
    return newToolSourceWithTools
  }

  updateToolSource = async (toolSource: AgentToolSource) => {
    const updatedToolSource = await API.updateToolSource(toolSource)
    this.update(state => {
      const index = state.toolSources.findIndex(ts => ts.id === toolSource.id)
      if (index !== -1) {
        state.toolSources[index] = {
          ...updatedToolSource,
          tools: state.toolSources[index].tools,
        }
      }
      return state
    })
    if (toolSource.agentId) {
      await this.fetchAgents()
    }
    return updatedToolSource
  }

  deleteToolSource = async (toolSourceId: string) => {
    await API.deleteToolSource(toolSourceId)
    this.update(state => {
      state.toolSources = state.toolSources.filter(ts => ts.id !== toolSourceId)
      return state
    })
    await this.fetchAgents()
  }

  getToolSource = (type: string) => {
    return get(this.store).toolSources.find(ts => ts.type === type)
  }

  setCurrentChatId = (chatId: string) => {
    this.update(state => {
      state.currentChatId = chatId
      return state
    })
  }

  clearCurrentChatId = () => {
    this.update(state => {
      state.currentChatId = undefined
      return state
    })
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

  deleteAgent = async (agentId: string) => {
    await API.deleteAgent(agentId)
    await this.fetchAgents()
  }
}
export const agentsStore = new AgentsStore()
export const selectedAgent = derived(agentsStore, state =>
  state.agents.find(a => a._id === state.currentAgentId)
)
