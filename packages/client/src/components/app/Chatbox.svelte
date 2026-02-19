<script lang="ts">
  import { createAPIClient } from "@budibase/frontend-core"
  import ChatConversationPanel from "@budibase/frontend-core/src/components/Chatbox/ChatConversationPanel.svelte"
  import ChatNavigationPanel from "@budibase/frontend-core/src/components/Chatbox/ChatNavigationPanel.svelte"
  import { Body, notifications } from "@budibase/bbui"
  import {
    Header,
    ensureValidTheme,
    getThemeClassNames,
  } from "@budibase/shared-core"
  import type {
    ChatAppAgent,
    ChatConversation,
    DraftChatConversation,
    Theme,
    WithoutDocMetadata,
  } from "@budibase/types"
  import { appStore, authStore, themeStore } from "@/stores"
  import { onMount } from "svelte"

  type ChatConversationLike = ChatConversation | DraftChatConversation

  type EnabledAgentListItem = {
    agentId: string
    name?: string
    isDefault?: boolean
    icon?: string
    iconColor?: string
  }

  type ChatUser = {
    firstName?: string
    lastName?: string
    email?: string
  }

  type ChatAppAgentMetadata = {
    _id?: string
    name: string
    icon?: string
    iconColor?: string
    live?: boolean
  }

  const INITIAL_CHAT: WithoutDocMetadata<DraftChatConversation> = {
    title: "",
    messages: [],
    chatAppId: "",
    agentId: "",
  }

  const API = createAPIClient({
    attachHeaders: headers => {
      if (workspaceId) {
        headers[Header.APP_ID] = workspaceId
      }
    },
  })

  let chat: ChatConversationLike = { ...INITIAL_CHAT }
  let deletingChat = false
  let loading = true
  let initialPrompt = ""
  let selectedAgentId: string | null = null
  let enabledAgentList: EnabledAgentListItem[] = []
  let conversationHistory: ChatConversation[] = []
  let selectedConversationId: string | undefined
  let chatAppId = ""
  let chatAgents: ChatAppAgent[] = []
  let agents: ChatAppAgentMetadata[] = []
  let chatTheme: Theme | undefined

  const getUserLabel = (user?: ChatUser) => {
    if (!user) {
      return ""
    }

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }

    if (user.firstName) {
      return user.firstName
    }

    if (user.lastName) {
      return user.lastName
    }

    return user.email || ""
  }

  $: workspaceId = $appStore?.appId ?? ""
  $: userName = getUserLabel($authStore)
  $: filteredConversationHistory = conversationHistory.filter(conversation => {
    if (!conversation?.agentId) {
      return false
    }
    const agent = agents.find(item => item._id === conversation.agentId)
    return Boolean(agent?.live)
  })
  $: hasAnyAgents = agents.length > 0
  $: hasEnabledAgents = enabledAgentList.length > 0
  $: showEmptyState = !loading && !hasEnabledAgents
  $: emptyStateMessage = hasAnyAgents
    ? "No agents enabled for this chat app. Ask your administrator to enable one to start chatting."
    : "No agents have been configured for this chat app yet."
  $: selectedAgentName = selectedAgentId
    ? enabledAgentList.find(agent => agent.agentId === selectedAgentId)?.name ||
      agents.find(agent => agent._id === selectedAgentId)?.name ||
      "Unknown agent"
    : ""
  $: conversationStarters =
    chatAgents.find(agent => agent.agentId === selectedAgentId)
      ?.conversationStarters || []
  $: resolvedTheme = ensureValidTheme(chatTheme, $themeStore.theme)
  $: resolvedThemeClassNames = getThemeClassNames(resolvedTheme)
  $: isAgentKnown = selectedAgentId
    ? agents.some(agent => agent._id === selectedAgentId)
    : false
  $: isAgentLive = selectedAgentId
    ? agents.some(agent => agent._id === selectedAgentId && agent.live)
    : false

  const agentIconColors = [
    "#6366F1",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
    "#EF4444",
  ]

  const refreshConversations = async () => {
    if (!chatAppId) {
      conversationHistory = []
      return []
    }
    const conversations = await API.fetchChatHistory(chatAppId)
    conversationHistory = conversations || []
    return conversationHistory
  }

  const refreshChatData = async () => {
    if (!workspaceId) {
      loading = false
      return
    }

    loading = true
    try {
      const chatApp = await API.fetchChatApp(workspaceId)

      chatAppId = chatApp?._id || ""
      chatTheme = chatApp?.theme as Theme | undefined
      chatAgents = chatApp?.agents || []
      const agentsResponse = chatAppId
        ? await API.get<{ agents: ChatAppAgentMetadata[] }>({
            url: `/api/chatapps/${chatAppId}/agents`,
          })
        : { agents: [] }
      agents = agentsResponse?.agents || []

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
              agentIconColors[index % agentIconColors.length],
          }
        })
        .filter(agent => Boolean(agent.name))

      const defaultAgent = baseAgentList.find(agent => agent.isDefault)
      const sortedAgents = baseAgentList
        .filter(agent => !agent.isDefault)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))

      enabledAgentList = defaultAgent
        ? [defaultAgent, ...sortedAgents]
        : sortedAgents

      await refreshConversations()
    } catch (err) {
      console.error(err)
      notifications.error("Failed to load chat")
      enabledAgentList = []
      conversationHistory = []
    } finally {
      loading = false
    }
  }

  const selectAgent = async (agentId: string) => {
    selectedAgentId = agentId
    selectedConversationId = undefined
    chat = {
      ...INITIAL_CHAT,
      chatAppId,
      agentId,
    }
  }

  const selectChat = async (selectedChat: ChatConversation) => {
    if (!selectedChat.agentId) {
      return
    }
    selectedAgentId = selectedChat.agentId
    selectedConversationId = selectedChat._id
    chat = {
      ...selectedChat,
      agentId: selectedChat.agentId,
      chatAppId: selectedChat.chatAppId || chatAppId,
    }
  }

  const deleteCurrentChat = async () => {
    if (!chat?._id || deletingChat || !chatAppId) {
      return
    }

    deletingChat = true
    try {
      await API.deleteChatConversation(chat._id, chatAppId)
      const updatedConversations = await refreshConversations()
      if (updatedConversations.length) {
        await selectChat(updatedConversations[0])
      } else {
        selectedAgentId = null
        selectedConversationId = undefined
        chat = { ...INITIAL_CHAT, chatAppId }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete chat"
      notifications.error(message)
    } finally {
      deletingChat = false
    }
  }

  const handleChatSaved = async (
    event: CustomEvent<{ chatId?: string; chat: ChatConversationLike }>
  ) => {
    const { chatId, chat: savedChat } = event.detail
    const updatedConversations = await refreshConversations()
    const lastMessageId = savedChat.messages[savedChat.messages.length - 1]?.id

    const newCurrentChat =
      updatedConversations.find(conversation => conversation._id === chatId) ||
      (lastMessageId
        ? updatedConversations.find(conversation =>
            conversation.messages?.some(message => message.id === lastMessageId)
          )
        : undefined)

    if (!newCurrentChat?._id) {
      return
    }

    selectedConversationId = newCurrentChat._id
    chat = {
      ...newCurrentChat,
      chatAppId: newCurrentChat.chatAppId || chatAppId,
    }

    if (initialPrompt) {
      initialPrompt = ""
    }
  }

  const handleAgentSelected = (event: CustomEvent<{ agentId: string }>) => {
    selectAgent(event.detail.agentId)
  }

  const handleConversationSelected = (
    event: CustomEvent<{ conversationId: string }>
  ) => {
    const conversation = filteredConversationHistory.find(
      convo => convo._id === event.detail.conversationId
    )

    if (conversation) {
      selectChat(conversation)
    }
  }

  const handleStartChat = async (
    event: CustomEvent<{ agentId: string; prompt: string }>
  ) => {
    await selectAgent(event.detail.agentId)
    initialPrompt = event.detail.prompt
  }

  onMount(async () => {
    await refreshChatData()
  })
</script>

<div
  class={`chat-app-shell spectrum spectrum--medium ${resolvedThemeClassNames}`}
>
  {#if showEmptyState}
    <div class="chat-empty-state">
      <Body size="M">{emptyStateMessage}</Body>
    </div>
  {:else}
    <ChatNavigationPanel
      {enabledAgentList}
      conversationHistory={filteredConversationHistory}
      {selectedConversationId}
      on:agentSelected={handleAgentSelected}
      on:conversationSelected={handleConversationSelected}
    />

    <ChatConversationPanel
      bind:chat
      {deletingChat}
      {enabledAgentList}
      {selectedAgentId}
      {selectedAgentName}
      {workspaceId}
      {userName}
      {conversationStarters}
      {isAgentKnown}
      {isAgentLive}
      {initialPrompt}
      {loading}
      on:deleteChat={deleteCurrentChat}
      on:chatSaved={handleChatSaved}
      on:agentSelected={handleAgentSelected}
      on:startChat={handleStartChat}
    />
  {/if}
</div>

<style>
  .chat-app-shell {
    display: flex;
    flex: 1 1 auto;
    align-items: stretch;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
  }

  .chat-empty-state {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    text-align: center;
  }

  @media (max-width: 1000px) {
    .chat-app-shell {
      flex-direction: column;
      overflow-y: auto;
    }

    .chat-app-shell :global(.chat-nav-shell) {
      width: 100%;
      min-width: 100%;
      border-right: 0;
      border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    }
  }
</style>
