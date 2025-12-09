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

  ensureChatAppForAgent = async (
    agentId: string,
    workspaceId?: string
  ): Promise<ChatApp> => {
    const state = get(this.store)
    const chatApp = await API.fetchChatApp(
      agentId,
      workspaceId || state.workspaceId
    )

    if (!chatApp?._id) {
      throw new Error("Chat app could not be retrieved or created")
    }

    const updated = chatApp.agentIds?.includes(agentId)
      ? chatApp
      : await API.updateChatApp({
          ...chatApp,
          agentIds: [...(chatApp.agentIds || []), agentId],
        })

    this.update(state => {
      state.chatAppId = updated._id
      state.workspaceId = workspaceId || state.workspaceId
      return state
    })

    return updated
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

  selectChatAppForAgent = async (
    agentId?: string,
    workspaceId?: string
  ): Promise<ChatApp | undefined> => {
    if (!agentId) {
      this.reset(workspaceId)
      return
    }

    const chatApp = await this.ensureChatAppForAgent(agentId, workspaceId)
    await this.fetchChats(chatApp._id!)
    return chatApp
  }

  removeChat = async (chatConversationId: string, chatAppId?: string) => {
    await API.deleteChatConversation(chatConversationId)
    if (chatAppId || get(this.store).chatAppId) {
      await this.fetchChats(chatAppId)
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
