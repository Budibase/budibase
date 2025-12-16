import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { ChatApp, ChatConversation } from "@budibase/types"
import { get } from "svelte/store"

interface ChatAppsStoreState {
  conversations: ChatConversation[]
  chatAppId?: string
  currentConversationId?: string
  workspaceId?: string
}

export class ChatAppsStore extends BudiStore<ChatAppsStoreState> {
  constructor() {
    super({
      conversations: [],
      chatAppId: undefined,
      currentConversationId: undefined,
      workspaceId: undefined,
    })
  }

  reset = (workspaceId?: string) => {
    this.update(state => {
      state.conversations = []
      state.chatAppId = undefined
      state.currentConversationId = undefined
      state.workspaceId = workspaceId || state.workspaceId
      return state
    })
  }

  ensureChatApp = async (
    workspaceId?: string,
    preferredAgentId?: string
  ): Promise<ChatApp | null> => {
    const state = get(this.store)
    let chatApp = await API.fetchChatApp(workspaceId || state.workspaceId)

    if (!chatApp?._id) {
      return null
    }

    if (preferredAgentId && chatApp.agentId !== preferredAgentId) {
      chatApp = await API.setChatAppAgent(chatApp._id, preferredAgentId)
    }

    this.update(state => {
      state.chatAppId = chatApp._id
      state.workspaceId = workspaceId || state.workspaceId
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

  initConversations = async (
    workspaceId?: string,
    fallbackAgentId?: string
  ) => {
    const chatApp = await this.ensureChatApp(workspaceId, fallbackAgentId)
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
