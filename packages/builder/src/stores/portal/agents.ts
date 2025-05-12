import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { AgentChat } from "@budibase/types"

interface AgentStore {
  chats: AgentChat[]
  currentChatId?: string
}

export class AgentsStore extends BudiStore<AgentStore> {
  constructor() {
    super({
      chats: [],
    })

    this.removeChat = this.removeChat.bind(this)
    this.fetchChats = this.fetchChats.bind(this)
    this.setCurrentChatId = this.setCurrentChatId.bind(this)
    this.init = this.init.bind(this)
  }

  async init() {
    await this.fetchChats()
  }

  async fetchChats() {
    const chats = await API.fetchChats()
    this.update(state => {
      state.chats = chats
      return state
    })
    return chats
  }

  async removeChat(chatId: string) {
    return await API.removeChat(chatId)
  }

  setCurrentChatId(chatId: string) {
    this.update(state => {
      state.currentChatId = chatId
      return state
    })
  }

  clearCurrentChatId() {
    this.update(state => {
      state.currentChatId = undefined
      return state
    })
  }
}

export const agentsStore = new AgentsStore()
