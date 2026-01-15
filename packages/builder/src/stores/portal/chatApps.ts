import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { ChatApp, ChatConversation } from "@budibase/types"
import { derived, get } from "svelte/store"

interface ChatAppsStoreState {
  chatAppId?: string
  chatAppsById: Record<string, ChatApp>
  conversationsByAppId: Record<string, ChatConversation[]>
  currentConversationId?: string
}

export class ChatAppsStore extends BudiStore<ChatAppsStoreState> {
  constructor() {
    super({
      chatAppId: undefined,
      chatAppsById: {},
      conversationsByAppId: {},
      currentConversationId: undefined,
    })
  }

  private currentAppId?: string

  private getWorkspaceId = async () => {
    // Dynamic import avoids a circular dependency with `@/stores/builder` which
    // itself imports from `@/stores/portal`.
    const mod = await import("@/stores/builder")
    const appStore: any = (mod as any).appStore
    if (typeof appStore?.subscribe !== "function") {
      return undefined
    }

    type AppStoreState = { appId?: string }
    const state = get(appStore as any) as AppStoreState
    const nextAppId: string | undefined = state?.appId || undefined
    if (this.currentAppId && nextAppId && this.currentAppId !== nextAppId) {
      this.reset()
    }
    this.currentAppId = nextAppId
    return nextAppId
  }

  reset = () => {
    this.update(state => {
      state.chatAppId = undefined
      state.chatAppsById = {}
      state.conversationsByAppId = {}
      state.currentConversationId = undefined
      return state
    })
  }

  ensureChatApp = async (
    agentId?: string,
    workspaceIdOverride?: string
  ): Promise<ChatApp | null> => {
    const workspaceId = workspaceIdOverride || (await this.getWorkspaceId())
    if (!workspaceId) {
      return null
    }

    let chatApp = await API.fetchChatApp(workspaceId)

    if (!chatApp) {
      return null
    }

    const chatAppId = chatApp._id
    if (!chatAppId) {
      return null
    }

    if (agentId) {
      const isEnabled = chatApp.enabledAgents?.some(
        agent => agent.agentId === agentId
      )
      if (!isEnabled) {
        chatApp = await API.setChatAppAgent(chatAppId, agentId)
      }
    }

    if (!chatApp) {
      return null
    }

    this.update(state => {
      state.chatAppId = chatAppId
      state.chatAppsById[chatAppId] = chatApp
      return state
    })

    return chatApp
  }

  updateEnabledAgents = async (enabledAgents: ChatApp["enabledAgents"]) => {
    const { chatAppId, chatAppsById } = get(this.store)
    const chatApp = chatAppId ? chatAppsById[chatAppId] : undefined
    if (!chatAppId || !chatApp) {
      return null
    }

    const updated = await API.updateChatApp({
      ...chatApp,
      enabledAgents,
    })

    this.update(state => {
      state.chatAppsById[chatAppId] = updated
      return state
    })

    return updated
  }

  fetchConversations = async (chatAppId?: string) => {
    const targetChatAppId = chatAppId || get(this.store).chatAppId
    if (!targetChatAppId) {
      return []
    }

    const conversations = await API.fetchChatHistory(targetChatAppId)
    this.update(state => {
      state.conversationsByAppId[targetChatAppId] = conversations
      return state
    })
    return conversations
  }

  initConversations = async ({
    agentId,
    workspaceId,
  }: {
    agentId?: string
    workspaceId?: string
  } = {}) => {
    const chatApp = await this.ensureChatApp(agentId, workspaceId)
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

export const currentChatApp = derived(chatAppsStore, state =>
  state.chatAppId ? state.chatAppsById[state.chatAppId] : undefined
)

export const currentConversations = derived(chatAppsStore, state =>
  state.chatAppId ? state.conversationsByAppId[state.chatAppId] || [] : []
)
