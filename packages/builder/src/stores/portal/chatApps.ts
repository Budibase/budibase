import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { ChatApp, ChatConversation } from "@budibase/types"
import { get } from "svelte/store"

interface ChatAppsStoreState {
  chats: ChatConversation[]
  chatAppId?: string
  currentChatId?: string
  workspaceId?: string
}

export class ChatAppsStore extends BudiStore<ChatAppsStoreState> {
  constructor() {
    super({
      chats: [],
      chatAppId: undefined,
      currentChatId: undefined,
      workspaceId: undefined,
    })
  }

  reset = (workspaceId?: string) => {
    this.update(state => {
      state.chats = []
      state.chatAppId = undefined
      state.currentChatId = undefined
      state.workspaceId = workspaceId || state.workspaceId
      return state
    })
  }

  ensureChatApp = async (
    workspaceId?: string,
    fallbackAgentId?: string
  ): Promise<ChatApp | null> => {
    const state = get(this.store)
    const chatApp = await API.fetchChatApp(
      fallbackAgentId,
      workspaceId || state.workspaceId
    )

    if (!chatApp?._id) {
      return null
    }

    this.update(state => {
      state.chatAppId = chatApp._id
      state.workspaceId = workspaceId || state.workspaceId
      return state
    })

    return chatApp
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

    const chats = await API.fetchChatHistory(targetChatAppId)
    this.update(state => {
      state.chats = chats
      return state
    })
    return chats
  }

  initChats = async (workspaceId?: string, fallbackAgentId?: string) => {
    const chatApp = await this.ensureChatApp(workspaceId, fallbackAgentId)
    if (chatApp?._id) {
      await this.fetchChats(chatApp._id)
    }
    return chatApp
  }

  removeChat = async (chatConversationId: string, chatAppId?: string) => {
    const targetChatAppId = chatAppId || get(this.store).chatAppId
    if (!targetChatAppId) {
      return
    }
    await API.deleteChatConversation(chatConversationId, targetChatAppId)
    if (targetChatAppId) {
      await this.fetchChats(targetChatAppId)
    }
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

export const chatAppsStore = new ChatAppsStore()
