import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  AgentChat,
  AgentToolSource,
  AgentToolSourceWithTools,
  CreateToolSourceRequest,
} from "@budibase/types"
import { get } from "svelte/store"

interface AgentStore {
  chats: AgentChat[]
  currentChatId?: string
  toolSources: AgentToolSourceWithTools[]
}

export class AgentsStore extends BudiStore<AgentStore> {
  constructor() {
    super({
      chats: [],
      toolSources: [],
    })
  }

  init = async () => {
    await this.fetchChats()
    await this.fetchToolSources()
  }

  fetchChats = async () => {
    const chats = await API.fetchChats()
    this.update(state => {
      state.chats = chats
      return state
    })
    return chats
  }

  removeChat = async (chatId: string) => {
    return await API.removeChat(chatId)
  }

  fetchToolSources = async () => {
    const toolSources = await API.fetchToolSources()
    this.update(state => {
      state.toolSources = toolSources
      return state
    })
    return toolSources
  }

  createToolSource = async (toolSource: CreateToolSourceRequest) => {
    await API.createToolSource(toolSource)
    const newToolSourceWithTools: AgentToolSourceWithTools = {
      ...toolSource,
      tools: [],
    }
    this.update(state => {
      state.toolSources = [...state.toolSources, newToolSourceWithTools]
      return state
    })
    return newToolSourceWithTools
  }

  updateToolSource = async (toolSource: AgentToolSource) => {
    const updatedToolSource = await API.updateToolSource(toolSource)
    this.update(state => {
      const index = state.toolSources.findIndex(ts => ts._id === toolSource._id)
      if (index !== -1) {
        state.toolSources[index] = {
          ...updatedToolSource,
          tools: state.toolSources[index].tools,
        }
      }
      return state
    })
    return updatedToolSource
  }

  deleteToolSource = async (toolSourceId: string) => {
    await API.deleteToolSource(toolSourceId)
    this.update(state => {
      state.toolSources = state.toolSources.filter(
        ts => ts._id !== toolSourceId
      )
      return state
    })
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
}

export const agentsStore = new AgentsStore()
