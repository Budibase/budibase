import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  Agent,
  AgentToolSource,
  AgentToolSourceWithTools,
  ChatConversation,
  CreateAgentRequest,
  CreateToolSourceRequest,
  ChatApp,
  UpdateAgentRequest,
} from "@budibase/types"
import { derived, get } from "svelte/store"

interface AgentStoreState {
  agents: Agent[]
  currentAgentId?: string
  chats: ChatConversation[]
  currentChatId?: string
  toolSources: AgentToolSourceWithTools[]
  agentsLoaded: boolean
  chatAppId?: string
  workspaceId?: string
}

export class AgentsStore extends BudiStore<AgentStoreState> {
  constructor() {
    super({
      agents: [],
      chats: [],
      toolSources: [],
      agentsLoaded: false,
      chatAppId: undefined,
      workspaceId: undefined,
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

  fetchChats = async (chatAppId?: string) => {
    const targetChatAppId = chatAppId || get(this.store).chatAppId
    if (!targetChatAppId) {
      this.update(state => {
        state.chats = []
        return state
      })
      return []
    }
    const chats = await API.fetchChats(targetChatAppId)
    this.update(state => {
      state.chats = chats
      return state
    })
    return chats
  }

  removeChat = async (chatId: string, chatAppId?: string) => {
    await API.removeChat(chatId)
    if (chatAppId || get(this.store).chatAppId) {
      await this.fetchChats(chatAppId)
    }
  }

  ensureChatAppForAgent = async (
    agentId: string,
    workspaceId?: string
  ): Promise<ChatApp> => {
    const state = get(this.store)
    const chatApp = await API.fetchChatApp(
      agentId,
      workspaceId || state.workspaceId
    )
    if (chatApp && chatApp.agentIds?.includes(agentId)) {
      this.update(state => {
        state.chatAppId = chatApp._id
        state.workspaceId = workspaceId || state.workspaceId
        return state
      })
      return chatApp
    }
    if (!chatApp?._id) {
      throw new Error("Chat app could not be retrieved or created")
    }
    const updated = await API.updateChatApp({
      ...chatApp,
      agentIds: [...(chatApp.agentIds || []), agentId],
    })
    this.update(state => {
      state.chatAppId = updated._id
      return state
    })
    return updated
  }

  selectAgent = async (agentId: string | undefined, workspaceId?: string) => {
    if (!agentId) {
      this.update(state => {
        state.currentAgentId = undefined
        state.chatAppId = undefined
        state.workspaceId = workspaceId || state.workspaceId
        state.chats = []
        state.toolSources = []
        return state
      })
      return
    }

    this.update(state => {
      state.currentAgentId = agentId
      state.workspaceId = workspaceId || state.workspaceId
      return state
    })

    const chatApp = await this.ensureChatAppForAgent(agentId, workspaceId)

    await this.fetchChats(chatApp._id!)
    await this.fetchToolSources(agentId)
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
