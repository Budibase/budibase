<script lang="ts">
  import {
    agentsStore,
    chatAppsStore,
    currentChatApp,
    currentConversations,
  } from "@/stores/portal"
  import { notifications } from "@budibase/bbui"
  import type {
    ChatConversation,
    DraftChatConversation,
    WithoutDocMetadata,
  } from "@budibase/types"
  import { onMount } from "svelte"

  import ChatConversationPanel from "./ChatConversationPanel.svelte"
  import ChatNavigationPanel from "./ChatNavigationPanel.svelte"

  type ChatConversationLike = ChatConversation | DraftChatConversation

  const INITIAL_CHAT: WithoutDocMetadata<DraftChatConversation> = {
    title: "",
    messages: [],
    chatAppId: "",
    agentId: "",
  }

  type EnabledAgent = { agentId: string }

  export let workspaceId: string

  let chat: ChatConversationLike = { ...INITIAL_CHAT }
  let deletingChat: boolean = false
  let initializedWorkspaceId: string | null = null

  // Local selection state for display and chat drafting.
  // Synced with `agentsStore.currentAgentId` so external changes (e.g. settings)
  // are reflected here.
  let selectedAgentId: string | null = null
  let syncingAgentSelection = false
  let lastObservedAgentId: string | null = null

  $: agents = $agentsStore.agents || []
  $: chatApp = $currentChatApp
  $: enabledAgents = chatApp?.enabledAgents || []
  $: conversationHistory = $currentConversations

  const getAgentName = (agentId: string) =>
    agents.find(agent => agent._id === agentId)?.name

  $: selectedAgentName = selectedAgentId
    ? getAgentName(selectedAgentId) || "Unknown agent"
    : ""

  $: enabledAgentList = enabledAgents
    .map(agent => ({
      agentId: agent.agentId,
      name: getAgentName(agent.agentId),
    }))
    .filter(agent => Boolean(agent.name))

  const initChatApp = async (nextWorkspaceId: string) => {
    if (!nextWorkspaceId || initializedWorkspaceId === nextWorkspaceId) {
      return
    }

    // Switching applications/workspaces: clear any stale chat state first.
    initializedWorkspaceId = nextWorkspaceId
    selectedAgentId = null
    lastObservedAgentId = null
    chat = { ...INITIAL_CHAT }
    chatAppsStore.reset()
    await agentsStore.selectAgent(undefined)

    await chatAppsStore.initConversations({ workspaceId: nextWorkspaceId })
  }

  $: if (workspaceId) {
    initChatApp(workspaceId)
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
        // Return to blank state (agent still selected)
        chat = { ...INITIAL_CHAT, chatAppId: $chatAppsStore.chatAppId || "" }
        chatAppsStore.clearCurrentConversationId()
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

  onMount(async () => {
    await agentsStore.init()
  })
</script>

<ChatNavigationPanel
  {enabledAgentList}
  {conversationHistory}
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
  on:deleteChat={deleteCurrentChat}
  on:chatSaved={handleChatSaved}
  on:agentSelected={handleAgentSelected}
/>
