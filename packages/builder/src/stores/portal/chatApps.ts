import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { ChatApp, ChatConversation } from "@budibase/types"
import { get } from "svelte/store"

interface ChatAppsStoreState {
  conversations: ChatConversation[]
  chatAppId?: string
  currentConversationId?: string
}

export class ChatAppsStore extends BudiStore<ChatAppsStoreState> {
  private workspaceId?: string

  constructor() {
    super({
      conversations: [],
      chatAppId: undefined,
      currentConversationId: undefined,
    })
  }

  private syncWorkspace = () => {
    const workspaceId = API.getAppID()
    if (workspaceId && this.workspaceId && workspaceId !== this.workspaceId) {
      this.reset()
    }
    this.workspaceId = workspaceId
    return workspaceId
  }

  reset = () => {
    this.update(state => {
      state.conversations = []
      state.chatAppId = undefined
      state.currentConversationId = undefined
      return state
    })
  }

  ensureChatApp = async (agentId?: string): Promise<ChatApp | null> => {
    const workspaceId = this.syncWorkspace()
    if (!workspaceId) {
      return null
    }

    let chatApp = await API.fetchChatApp()

    if (!chatApp?._id) {
      return null
    }

    if (agentId && chatApp.agentId !== agentId) {
      chatApp = await API.setChatAppAgent(chatApp._id, agentId)
    }

    this.update(state => {
      state.chatAppId = chatApp._id
      return state
    })

    return chatApp
  }

  fetchConversations = async (chatAppId?: string) => {
    const targetChatAppId = chatAppId || get(this.store).chatAppId
    if (!targetChatAppId) {
      this.update(state => {
        state.conversations = []
        return state
      })
      return []
    }

    const conversations = await API.fetchChatHistory(targetChatAppId)
    this.update(state => {
      state.conversations = conversations
      return state
    })
    return conversations
  }

  initConversations = async (agentId?: string) => {
    const chatApp = await this.ensureChatApp(agentId)
    if (chatApp?._id) {
      await this.fetchConversations(chatApp._id)
    }
    return chatApp
  }

  removeConversation = async (
    chatConversationId: string,
    chatAppId?: string
  ) => {
    const targetChatAppId = chatAppId || get(this.store).chatAppId
    if (!targetChatAppId) {
      return
    }
    await API.deleteChatConversation(chatConversationId, targetChatAppId)
    if (targetChatAppId) {
      await this.fetchConversations(targetChatAppId)
    }
  }

  setCurrentConversationId = (chatId: string) => {
    this.update(state => {
      state.currentConversationId = chatId
      return state
    })
  }

  clearCurrentConversationId = () => {
    this.update(state => {
      state.currentConversationId = undefined
      return state
    })
  }
}

export const chatAppsStore = new ChatAppsStore()
