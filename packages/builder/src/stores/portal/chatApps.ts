import { Constants } from "@budibase/frontend-core"
import { ChatApp, ChatConversation } from "@budibase/types"
import { derived, get } from "svelte/store"
import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import { agentsStore } from "./agents"

interface ChatAppsStoreState {
  chatAppId?: string
  chatAppsById: Record<string, ChatApp>
  conversationsByAppId: Record<string, ChatConversation[]>
  currentConversationId?: string
}

type ChatAppAgent = NonNullable<ChatApp["agents"]>[number]

interface BuildAgentChatUpdateInput {
  agents: ChatAppAgent[]
  agentId: string
  enable: boolean
}

interface BuildAgentChatUpdateResult {
  agents: ChatAppAgent[]
  live?: true
}

const pickDefaultEnabledAgentId = (agents: ChatAppAgent[]) => {
  const existingDefault = agents.find(
    agent => agent.isEnabled && agent.isDefault
  )
  if (existingDefault) {
    return existingDefault.agentId
  }

  return agents.find(agent => agent.isEnabled)?.agentId
}

const normalizeDefaultAgent = (agents: ChatAppAgent[]) => {
  const defaultAgentId = pickDefaultEnabledAgentId(agents)
  return agents.map(agent => ({
    ...agent,
    isDefault: !!defaultAgentId && agent.agentId === defaultAgentId,
  }))
}

const buildAgentChatUpdate = ({
  agents,
  agentId,
  enable,
}: BuildAgentChatUpdateInput): BuildAgentChatUpdateResult => {
  if (enable) {
    const existingEntry = agents.find(agent => agent.agentId === agentId)
    const nextAgents = normalizeDefaultAgent(
      existingEntry
        ? agents.map(agent =>
            agent.agentId === agentId
              ? {
                  ...agent,
                  isEnabled: true,
                }
              : agent
          )
        : [
            ...agents,
            {
              agentId,
              isEnabled: true,
              isDefault: false,
              roleId: Constants.Roles.BASIC,
            },
          ]
    )

    return {
      agents: nextAgents,
      live: true,
    }
  }

  return {
    agents: normalizeDefaultAgent(
      agents.map(agent =>
        agent.agentId === agentId
          ? {
              ...agent,
              isEnabled: false,
              isDefault: false,
            }
          : agent
      )
    ),
  }
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
      const matched = chatApp.agents?.find(agent => agent.agentId === agentId)
      if (!matched || !matched.isEnabled) {
        const createdAgent = await API.setChatAppAgent(chatAppId, agentId)
        const nextAgents = matched
          ? (chatApp.agents || []).map(agent =>
              agent.agentId === agentId ? createdAgent : agent
            )
          : [...(chatApp.agents || []), createdAgent]
        chatApp = {
          ...chatApp,
          agents: nextAgents,
        }
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

  updateChatApp = async (updates: Partial<ChatApp>) => {
    const { chatAppId, chatAppsById } = get(this.store)
    const chatApp = chatAppId ? chatAppsById[chatAppId] : undefined
    if (!chatAppId || !chatApp) {
      return null
    }

    const updated = await API.updateChatApp({
      ...chatApp,
      ...updates,
    })

    this.update(state => {
      state.chatAppsById[chatAppId] = updated
      return state
    })

    return updated
  }

  updateAgents = async (agents: ChatApp["agents"]) => {
    return await this.updateChatApp({ agents })
  }

  upsertAgentConfig = async ({
    agentId,
    updates,
    workspaceId,
  }: {
    agentId: string
    updates: Partial<Omit<ChatAppAgent, "agentId">>
    workspaceId?: string
  }): Promise<ChatApp | null> => {
    if (!agentId) {
      return null
    }

    const chatApp = await this.ensureChatApp(undefined, workspaceId)
    if (!chatApp) {
      return null
    }

    const agents = chatApp.agents || []
    const matched = agents.find(agent => agent.agentId === agentId)
    const nextAgent: ChatAppAgent = matched
      ? {
          ...matched,
          ...updates,
          agentId: matched.agentId,
        }
      : {
          agentId,
          isEnabled: false,
          isDefault: false,
          roleId: Constants.Roles.BASIC,
          ...updates,
        }

    const nextAgents = matched
      ? agents.map(agent => (agent.agentId === agentId ? nextAgent : agent))
      : [...agents, nextAgent]

    return await this.updateAgents(normalizeDefaultAgent(nextAgents))
  }

  toggleAgentDeploymentInChat = async (
    agentId: string,
    workspaceId: string
  ): Promise<{ enabled: boolean } | null> => {
    if (!agentId || !workspaceId) {
      return null
    }

    const chatApp = await this.ensureChatApp(undefined, workspaceId)
    if (!chatApp) {
      return null
    }

    const agents = chatApp.agents || []
    const isCurrentlyEnabled = agents.some(
      agent => agent.agentId === agentId && agent.isEnabled
    )
    const update = buildAgentChatUpdate({
      agents,
      agentId,
      enable: !isCurrentlyEnabled,
    })

    await this.updateChatApp(update)

    return {
      enabled: !isCurrentlyEnabled,
    }
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

const getSelectedChatAgent = (
  chatApp: ChatApp | undefined,
  agentId?: string
): ChatAppAgent | undefined =>
  agentId
    ? chatApp?.agents?.find(agent => agent.agentId === agentId)
    : undefined

export const selectedChatAgent = derived(
  [currentChatApp, agentsStore],
  ([$currentChatApp, $agentsStore]) =>
    getSelectedChatAgent($currentChatApp, $agentsStore.currentAgentId)
)
