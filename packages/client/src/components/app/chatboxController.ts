import type {
  ChatAppAgent,
  ChatConversation,
  DraftChatConversation,
} from "@budibase/types"
import { createDraftChat, isLockedAgentUnavailableError } from "./chatboxUtils"

export type ChatConversationLike = ChatConversation | DraftChatConversation
export type AgentAvailability =
  | "no_selection"
  | "deleted"
  | "offline"
  | "disabled"
  | "ready"

export interface EnabledAgentListItem {
  agentId: string
  name?: string
  isDefault?: boolean
  icon?: string
  iconColor?: string
}

export interface ChatAppAgentMetadata {
  _id?: string
  name: string
  icon?: string
  iconColor?: string
  live?: boolean
}

interface ChatboxAPI {
  fetchChatApp: (
    workspaceId?: string
  ) => Promise<{ _id?: string; agents?: ChatAppAgent[] } | null>
  fetchChatHistory: (
    chatAppId: string,
    agentId?: string
  ) => Promise<ChatConversation[]>
  deleteChatConversation: (
    chatConversationId: string,
    chatAppId: string,
    agentId?: string
  ) => Promise<void>
  get: <T>(params: { url: string }) => Promise<T>
}

interface ChatboxControllerConfig {
  api: ChatboxAPI
  lockedAgentId?: string
  notifyError: (message: string) => void
  agentIconColors: string[]
}

export interface ChatboxState {
  lockedAgentId?: string
  chat: ChatConversationLike
  deletingChat: boolean
  loading: boolean
  initialPrompt: string
  selectedAgentId: string | null
  enabledAgentList: EnabledAgentListItem[]
  conversationHistory: ChatConversation[]
  selectedConversationId?: string
  chatAppId: string
  chatAgents: ChatAppAgent[]
  agents: ChatAppAgentMetadata[]
  filteredConversationHistory: ChatConversation[]
  hasEnabledAgents: boolean
  isLockedAgentMode: boolean
  showEmptyState: boolean
  emptyStateMessage: string
  selectedAgentName: string
  conversationStarters: { prompt: string }[]
  agentAvailability: AgentAvailability
  suppressAgentPicker: boolean
}

const INITIAL_STATE = (lockedAgentId?: string): ChatboxState => ({
  lockedAgentId,
  chat: createDraftChat("", lockedAgentId),
  deletingChat: false,
  loading: true,
  initialPrompt: "",
  selectedAgentId: lockedAgentId || null,
  enabledAgentList: [],
  conversationHistory: [],
  selectedConversationId: undefined,
  chatAppId: "",
  chatAgents: [],
  agents: [],
  filteredConversationHistory: [],
  hasEnabledAgents: false,
  isLockedAgentMode: Boolean(lockedAgentId),
  showEmptyState: false,
  emptyStateMessage: "",
  selectedAgentName: "",
  conversationStarters: [],
  agentAvailability: "no_selection",
  suppressAgentPicker: false,
})

const getEmptyStateMessage = ({
  isLockedAgentMode,
  hasAnyAgents,
}: {
  isLockedAgentMode: boolean
  hasAnyAgents: boolean
}) => {
  if (isLockedAgentMode) {
    return "This agent is not available for chat right now."
  }

  if (hasAnyAgents) {
    return "No agents enabled for this chat app. Ask your administrator to enable one to start chatting."
  }

  return "No agents have been configured for this chat app yet."
}

const resolveSelectedAgentName = (state: ChatboxState) => {
  if (!state.selectedAgentId) {
    return ""
  }

  const selectedEnabledAgent = state.enabledAgentList.find(
    agent => agent.agentId === state.selectedAgentId
  )
  if (selectedEnabledAgent?.name) {
    return selectedEnabledAgent.name
  }

  const selectedAgent = state.agents.find(
    agent => agent._id === state.selectedAgentId
  )
  if (selectedAgent?.name) {
    return selectedAgent.name
  }

  return "Unknown agent"
}

const resolveAgentAvailability = ({
  selectedAgentId,
  agents,
  enabledAgentList,
}: {
  selectedAgentId: string | null
  agents: ChatAppAgentMetadata[]
  enabledAgentList: EnabledAgentListItem[]
}): AgentAvailability => {
  if (!selectedAgentId) {
    return "no_selection"
  }

  const selectedAgent = agents.find(agent => agent._id === selectedAgentId)
  if (!selectedAgent) {
    return "deleted"
  }

  if (!selectedAgent.live) {
    return "offline"
  }

  const isEnabled = enabledAgentList.some(
    agent => agent.agentId === selectedAgentId
  )
  if (!isEnabled) {
    return "disabled"
  }

  return "ready"
}

const resolveConversationScopeAgentId = ({
  lockedAgentId,
  selectedAgentId,
  fallbackAgentId,
}: {
  lockedAgentId?: string
  selectedAgentId: string | null
  fallbackAgentId?: string
}) => lockedAgentId || selectedAgentId || fallbackAgentId

const findSavedConversation = ({
  conversations,
  chatId,
  lastMessageId,
}: {
  conversations: ChatConversation[]
  chatId?: string
  lastMessageId?: string
}) => {
  const matchedById = conversations.find(
    conversation => conversation._id === chatId
  )
  if (matchedById) {
    return matchedById
  }

  if (!lastMessageId) {
    return undefined
  }

  return conversations.find(conversation =>
    conversation.messages?.some(message => message.id === lastMessageId)
  )
}

const withDerivedState = (state: ChatboxState): ChatboxState => {
  const filteredConversationHistory = state.conversationHistory.filter(
    conversation => {
      if (!conversation?.agentId) {
        return false
      }
      const agent = state.agents.find(item => item._id === conversation.agentId)
      return Boolean(agent?.live)
    }
  )

  const hasAnyAgents = state.agents.length > 0
  const hasEnabledAgents = state.enabledAgentList.length > 0
  const isLockedAgentMode = Boolean(state.lockedAgentId)
  const showEmptyState = !state.loading && !hasEnabledAgents
  const emptyStateMessage = getEmptyStateMessage({
    isLockedAgentMode,
    hasAnyAgents,
  })

  const selectedAgentName = resolveSelectedAgentName(state)

  const conversationStarters =
    state.chatAgents.find(agent => agent.agentId === state.selectedAgentId)
      ?.conversationStarters || []

  const agentAvailability = resolveAgentAvailability({
    selectedAgentId: state.selectedAgentId,
    agents: state.agents,
    enabledAgentList: state.enabledAgentList,
  })

  const suppressAgentPicker =
    isLockedAgentMode && state.loading && !state.selectedAgentId

  return {
    ...state,
    filteredConversationHistory,
    hasEnabledAgents,
    isLockedAgentMode,
    showEmptyState,
    emptyStateMessage,
    selectedAgentName,
    conversationStarters,
    agentAvailability,
    suppressAgentPicker,
  }
}

export class ChatboxController {
  private state: ChatboxState
  private listeners = new Set<(state: ChatboxState) => void>()
  private readonly api: ChatboxAPI
  private readonly notifyError: (message: string) => void
  private readonly agentIconColors: string[]

  constructor({
    api,
    notifyError,
    agentIconColors,
    lockedAgentId,
  }: ChatboxControllerConfig) {
    this.api = api
    this.notifyError = notifyError
    this.agentIconColors = agentIconColors
    this.state = withDerivedState(INITIAL_STATE(lockedAgentId))
  }

  subscribe(listener: (state: ChatboxState) => void) {
    this.listeners.add(listener)
    listener(this.state)
    return () => this.listeners.delete(listener)
  }

  setLockedAgentId(lockedAgentId?: string) {
    this.patch({
      lockedAgentId,
      selectedAgentId: lockedAgentId || this.state.selectedAgentId,
      chat: createDraftChat(this.state.chatAppId, lockedAgentId),
    })
  }

  async init(workspaceId: string) {
    if (!workspaceId) {
      this.patch({ loading: false })
      return
    }

    this.patch({ loading: true })
    try {
      const chatApp = await this.api.fetchChatApp(workspaceId)
      const chatAppId = chatApp?._id || ""
      const chatAgents = chatApp?.agents || []
      const agentsResponse = chatAppId
        ? await this.api.get<{ agents: ChatAppAgentMetadata[] }>({
            url: `/api/chatapps/${chatAppId}/agents`,
          })
        : { agents: [] }
      const agents = agentsResponse?.agents || []

      const baseAgentList = chatAgents
        .filter(agent => agent.isEnabled)
        .map((agent, index) => {
          const resolvedAgent = agents.find(item => item._id === agent.agentId)
          return {
            agentId: agent.agentId,
            name: resolvedAgent?.name,
            isDefault: agent.isDefault,
            icon: resolvedAgent?.icon || "SideKick",
            iconColor:
              resolvedAgent?.iconColor ||
              this.agentIconColors[index % this.agentIconColors.length],
          }
        })
        .filter(agent => Boolean(agent.name))

      const defaultAgent = baseAgentList.find(agent => agent.isDefault)
      const sortedAgents = baseAgentList
        .filter(agent => !agent.isDefault)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      const orderedAgentList = defaultAgent
        ? [defaultAgent, ...sortedAgents]
        : sortedAgents

      const enabledAgentList = this.state.lockedAgentId
        ? orderedAgentList.filter(
            agent => agent.agentId === this.state.lockedAgentId
          )
        : orderedAgentList

      this.patch({
        chatAppId,
        chatAgents,
        agents,
        enabledAgentList,
      })

      await this.refreshConversations(this.state.lockedAgentId)

      if (this.state.lockedAgentId && enabledAgentList.length > 0) {
        this.selectAgent(this.state.lockedAgentId)
      }
    } catch (error) {
      if (!isLockedAgentUnavailableError(error, this.state.lockedAgentId)) {
        this.notifyError("Failed to load chat")
      }
      this.patch({ enabledAgentList: [], conversationHistory: [] })
    } finally {
      this.patch({ loading: false })
    }
  }

  async selectAgent(agentId: string) {
    if (this.state.lockedAgentId && agentId !== this.state.lockedAgentId) {
      return
    }

    this.patch({
      selectedAgentId: agentId,
      selectedConversationId: undefined,
      chat: createDraftChat(this.state.chatAppId, agentId),
    })
  }

  selectConversation(conversation: ChatConversation) {
    if (!conversation.agentId) {
      return
    }

    this.patch({
      selectedAgentId: conversation.agentId,
      selectedConversationId: conversation._id,
      chat: {
        ...conversation,
        agentId: conversation.agentId,
        chatAppId: conversation.chatAppId || this.state.chatAppId,
      },
    })
  }

  async deleteCurrentChat() {
    const { chat, deletingChat, chatAppId } = this.state
    if (!chat?._id || deletingChat || !chatAppId) {
      return
    }

    await this.deleteConversation(chat._id, chat.agentId)
  }

  async deleteConversation(
    conversationId: string,
    conversationAgentId?: string
  ) {
    const { deletingChat, chatAppId, selectedConversationId } = this.state
    if (deletingChat || !chatAppId) {
      return
    }

    this.patch({ deletingChat: true })
    try {
      const conversationScopeAgentId = resolveConversationScopeAgentId({
        lockedAgentId: this.state.lockedAgentId,
        selectedAgentId: conversationAgentId || this.state.selectedAgentId,
      })

      await this.api.deleteChatConversation(
        conversationId,
        this.state.chatAppId,
        conversationScopeAgentId
      )
      const updatedConversations = await this.refreshConversations(
        conversationScopeAgentId
      )

      if (selectedConversationId === conversationId) {
        if (updatedConversations.length) {
          this.selectConversation(updatedConversations[0])
        } else {
          this.patch({
            selectedAgentId: this.state.lockedAgentId || null,
            selectedConversationId: undefined,
            chat: createDraftChat(
              this.state.chatAppId,
              this.state.lockedAgentId
            ),
          })
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete chat"
      this.notifyError(message)
    } finally {
      this.patch({ deletingChat: false })
    }
  }

  async handleChatSaved({
    chatId,
    chat,
  }: {
    chatId?: string
    chat: ChatConversationLike
  }) {
    const conversationScopeAgentId = resolveConversationScopeAgentId({
      lockedAgentId: this.state.lockedAgentId,
      selectedAgentId: this.state.selectedAgentId,
      fallbackAgentId: chat.agentId,
    })
    const updatedConversations = await this.refreshConversations(
      conversationScopeAgentId
    )
    const lastMessageId = chat.messages[chat.messages.length - 1]?.id

    const newCurrentChat = findSavedConversation({
      conversations: updatedConversations,
      chatId,
      lastMessageId,
    })

    if (!newCurrentChat?._id) {
      return
    }

    this.patch({
      selectedConversationId: newCurrentChat._id,
      chat: {
        ...newCurrentChat,
        chatAppId: newCurrentChat.chatAppId || this.state.chatAppId,
      },
      initialPrompt: "",
    })
  }

  async startChat(agentId: string, prompt: string) {
    const nextAgentId = this.state.lockedAgentId || agentId
    await this.selectAgent(nextAgentId)
    this.patch({ initialPrompt: prompt })
  }

  private async refreshConversations(agentId?: string) {
    if (!this.state.chatAppId) {
      this.patch({ conversationHistory: [] })
      return []
    }

    const conversationHistory =
      (await this.api.fetchChatHistory(this.state.chatAppId, agentId)) || []
    this.patch({ conversationHistory })
    return conversationHistory
  }

  private patch(next: Partial<ChatboxState>) {
    this.state = withDerivedState({ ...this.state, ...next })
    this.emit()
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.state)
    }
  }
}
