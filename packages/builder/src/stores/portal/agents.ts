import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { AgentChat, AgentToolSource, CreateToolSourceRequest } from "@budibase/types"

interface AgentStore {
  chats: AgentChat[]
  currentChatId?: string
  toolSources: AgentToolSource[]
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
    const newToolSource = await API.createToolSource(toolSource)
    this.update(state => {
      state.toolSources = [...state.toolSources, newToolSource]
      return state
    })
    return newToolSource
  }

  updateToolSource = async (toolSource: AgentToolSource) => {
    const updatedToolSource = await API.updateToolSource(toolSource)
    this.update(state => {
      const index = state.toolSources.findIndex(ts => ts._id === toolSource._id)
      if (index !== -1) {
        state.toolSources[index] = {
          ...updatedToolSource,
          tools: state.toolSources[index].tools
        }
      }
      return state
    })
    return updatedToolSource
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
