<script lang="ts">
  import {
    agentsStore,
    chatAppsStore,
    currentChatApp,
    currentConversations,
    selectedChatAgent,
  } from "@/stores/portal"
  import { Body, notifications } from "@budibase/bbui"
  import type {
    Agent,
    ChatConversation,
    ConversationStarter,
    DraftChatConversation,
    WithoutDocMetadata,
  } from "@budibase/types"
  import { onMount } from "svelte"

  import ChatConversationPanel from "./ChatConversationPanel.svelte"
  import ChatNavigationPanel from "./ChatNavigationPanel.svelte"

  type ChatConversationLike = ChatConversation | DraftChatConversation

  type ChatAgentConfig = {
    agentId: string
    isEnabled: boolean
    isDefault: boolean
    conversationStarters?: ConversationStarter[]
  }

  const INITIAL_CHAT: WithoutDocMetadata<DraftChatConversation> = {
    title: "",
    messages: [],
    chatAppId: "",
    agentId: "",
  }

  export let workspaceId: string

  let chat: ChatConversationLike = { ...INITIAL_CHAT }
  let deletingChat: boolean = false
  let initialPrompt = ""

  // Local selection state for display and chat drafting.
  // Synced with `agentsStore.currentAgentId` so external changes (e.g. settings)
  // are reflected here.
  let selectedAgentId: string | null = null
  let syncingAgentSelection = false
  let lastObservedAgentId: string | null = null
  let enabledAgentList: {
    agentId: string
    name?: string
    isDefault?: boolean
    icon?: string
    iconColor?: string
  }[] = []

  let chatAgents: ChatAgentConfig[] = []
  let agents: Agent[] = []

  $: agents = $agentsStore.agents || []
  $: agentsLoaded = $agentsStore.agentsLoaded
  $: chatApp = $currentChatApp
  $: chatAgents = (chatApp?.agents || []) as ChatAgentConfig[]
  $: conversationHistory = $currentConversations
  $: filteredConversationHistory = !agentsLoaded
    ? conversationHistory
    : conversationHistory.filter(conversation => {
        if (!conversation?.agentId) {
          return false
        }
        const agent = agents.find(item => item._id === conversation.agentId)
        return Boolean(agent?.live)
      })
  $: hasAnyAgents = agents.length > 0
  $: hasEnabledAgents = enabledAgentList.length > 0
  $: showEmptyState = agentsLoaded && !hasEnabledAgents
  $: emptyStateMessage = hasAnyAgents
    ? "No agents enabled for this chat app. Add one in Settings to start chatting."
    : "No agents yet. Add one from the settings panel to start chatting."
  $: conversationStarters = $selectedChatAgent?.conversationStarters || []
  $: isAgentKnown = selectedAgentId
    ? !agentsLoaded || agents.some(agent => agent._id === selectedAgentId)
    : false
  $: isAgentLive = selectedAgentId
    ? !agentsLoaded ||
      agents.some(agent => agent._id === selectedAgentId && agent.live)
    : false

  const agentIconColors = [
    "#6366F1",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
    "#EF4444",
  ]

  const getAgent = (agentId: string) =>
    agents.find(agent => agent._id === agentId)

  const getAgentName = (agentId: string) => getAgent(agentId)?.name

  const getAgentIcon = (agentId: string) =>
    getAgent(agentId)?.icon || "SideKick"

  const getAgentIconColor = (agentId: string, index: number) =>
    getAgent(agentId)?.iconColor ||
    agentIconColors[index % agentIconColors.length]

  $: selectedAgentName = selectedAgentId
    ? getAgentName(selectedAgentId) || "Unknown agent"
    : ""

  $: {
    const baseAgentList = chatAgents
      .filter(agent => agent.isEnabled)
      .map((agent, index) => ({
        agentId: agent.agentId,
        name: getAgentName(agent.agentId),
        isDefault: agent.isDefault,
        icon: getAgentIcon(agent.agentId),
        iconColor: getAgentIconColor(agent.agentId, index),
      }))
      .filter(agent => Boolean(agent.name))

    const defaultAgent = baseAgentList.find(agent => agent.isDefault)
    const sortedAgents = baseAgentList
      .filter(agent => !agent.isDefault)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))

    enabledAgentList = defaultAgent
      ? [defaultAgent, ...sortedAgents]
      : sortedAgents
  }

  $: storeAgentId = $agentsStore.currentAgentId || null
  $: if (storeAgentId !== lastObservedAgentId) {
    lastObservedAgentId = storeAgentId
    if (!syncingAgentSelection) {
      handleExternalAgentChange(storeAgentId)
    }
  }

  const handleExternalAgentChange = async (nextAgentId: string | null) => {
    if (!nextAgentId) {
      selectedAgentId = null
      chat = {
        ...INITIAL_CHAT,
        chatAppId: $chatAppsStore.chatAppId || "",
      }
      chatAppsStore.clearCurrentConversationId()
      return
    }

    const ensured = await chatAppsStore.ensureChatApp(nextAgentId, workspaceId)
    if (!ensured?._id) {
      notifications.error("Could not start chat")
      return
    }

    selectedAgentId = nextAgentId
    chat = {
      ...INITIAL_CHAT,
      chatAppId: ensured._id,
      agentId: nextAgentId,
    }
    chatAppsStore.clearCurrentConversationId()
  }

  const selectAgent = async (agentId: string) => {
    syncingAgentSelection = true
    try {
      const ensured = await chatAppsStore.ensureChatApp(agentId, workspaceId)
      if (!ensured?._id) {
        notifications.error("Could not start chat")
        return
      }

      selectedAgentId = agentId
      await agentsStore.selectAgent(agentId)
      chat = {
        ...INITIAL_CHAT,
        chatAppId: ensured._id,
        agentId,
      }
      chatAppsStore.clearCurrentConversationId()
    } finally {
      syncingAgentSelection = false
    }
  }

  const selectChat = async (selectedChat: ChatConversation) => {
    const resolvedAgentId = selectedChat.agentId
    if (!resolvedAgentId) {
      return
    }

    syncingAgentSelection = true
    try {
      selectedAgentId = resolvedAgentId
      await agentsStore.selectAgent(resolvedAgentId)

      chat = {
        ...selectedChat,
        agentId: resolvedAgentId,
        chatAppId: selectedChat.chatAppId || $chatAppsStore.chatAppId || "",
      }

      if (selectedChat._id) {
        chatAppsStore.setCurrentConversationId(selectedChat._id)
      }
    } finally {
      syncingAgentSelection = false
    }
  }

  const deleteCurrentChat = async () => {
    if (!selectedAgentId || !chat?._id || deletingChat) {
      return
    }

    deletingChat = true

    try {
      await chatAppsStore.removeConversation(chat._id, $chatAppsStore.chatAppId)
      const remainingConversations = $currentConversations
      if (remainingConversations.length) {
        const [nextChat] = remainingConversations
        await selectChat(nextChat)
      } else {
        syncingAgentSelection = true
        try {
          await agentsStore.selectAgent(undefined)
          selectedAgentId = null
          chat = { ...INITIAL_CHAT, chatAppId: $chatAppsStore.chatAppId || "" }
          chatAppsStore.clearCurrentConversationId()
        } finally {
          syncingAgentSelection = false
        }
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
    if (!selectedAgentId) {
      return
    }

    const { chatId, chat: savedChat } = event.detail
    const updatedConversations = await chatAppsStore.fetchConversations(
      $chatAppsStore.chatAppId
    )
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

    chat = {
      ...newCurrentChat,
      chatAppId: newCurrentChat.chatAppId || $chatAppsStore.chatAppId || "",
    }
    chatAppsStore.setCurrentConversationId(newCurrentChat._id)

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
    const conversation = conversationHistory.find(
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
    await agentsStore.init()

    if (workspaceId) {
      await chatAppsStore.initConversations({ workspaceId })
    }

    const conversationId = new URLSearchParams(window.location.search).get(
      "conversationId"
    )

    if (!conversationId) {
      return
    }

    const conversation = conversationHistory.find(
      convo => convo._id === conversationId
    )

    if (conversation) {
      await selectChat(conversation)
    }
  })
</script>

<div class="chat-app">
  {#if showEmptyState}
    <div class="chat-empty-state">
      <Body size="M">{emptyStateMessage}</Body>
    </div>
  {:else}
    <ChatNavigationPanel
      {enabledAgentList}
      conversationHistory={filteredConversationHistory}
      selectedConversationId={$chatAppsStore.currentConversationId}
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
      {conversationStarters}
      {isAgentKnown}
      {isAgentLive}
      {initialPrompt}
      on:deleteChat={deleteCurrentChat}
      on:chatSaved={handleChatSaved}
      on:agentSelected={handleAgentSelected}
      on:startChat={handleStartChat}
    />
  {/if}
</div>

<style>
  .chat-app {
    display: flex;
    flex: 1 1 auto;
    align-items: stretch;
    height: 100%;
    width: 100%;
    min-width: 0;
  }

  .chat-empty-state {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    text-align: center;
  }
</style>
