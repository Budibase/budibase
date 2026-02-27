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
  import type { ChatConversation } from "@budibase/types"
  import { appStore, authStore, themeStore } from "@/stores"
  import {
    ChatboxController,
    type ChatboxState,
    type ChatConversationLike,
  } from "./chatboxController"
  import { getLockedAgentIdFromCurrentPath } from "./chatboxUtils"
  import { onDestroy, onMount } from "svelte"

  type ChatUser = {
    firstName?: string
    lastName?: string
    email?: string
  }

  const API = createAPIClient({
    attachHeaders: headers => {
      if (workspaceId) {
        headers[Header.APP_ID] = workspaceId
      }
    },
  })

  let lockedAgentId: string | undefined = getLockedAgentIdFromCurrentPath()

  let chat: ChatConversationLike = {
    title: "",
    messages: [],
    chatAppId: "",
    agentId: lockedAgentId || "",
  }
  let deletingChat = false
  let loading = true
  let initialPrompt = ""
  let selectedAgentId: string | null = lockedAgentId || null
  let enabledAgentList: ChatboxState["enabledAgentList"] = []
  let filteredConversationHistory: ChatConversation[] = []
  let selectedConversationId: string | undefined
  let isLockedAgentMode = Boolean(lockedAgentId)
  let showEmptyState = false
  let emptyStateMessage = ""
  let selectedAgentName = ""
  let conversationStarters: { prompt: string }[] = []
  let agentAvailability: ChatboxState["agentAvailability"] = "no_selection"
  let suppressAgentPicker = false

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
  $: resolvedTheme = ensureValidTheme($themeStore.theme)
  $: resolvedThemeClassNames = getThemeClassNames(resolvedTheme)

  const agentIconColors = [
    "#6366F1",
    "#F59E0B",
    "#10B981",
    "#8B5CF6",
    "#EF4444",
  ]

  const controller = new ChatboxController({
    api: API,
    lockedAgentId,
    notifyError: message => notifications.error(message),
    agentIconColors,
  })

  const applyState = (state: ChatboxState) => {
    const next = state as ChatboxState & {
      filteredConversationHistory: ChatConversation[]
      isLockedAgentMode: boolean
      showEmptyState: boolean
      emptyStateMessage: string
      selectedAgentName: string
      conversationStarters: { prompt: string }[]
      agentAvailability: ChatboxState["agentAvailability"]
      suppressAgentPicker: boolean
    }

    lockedAgentId = next.lockedAgentId
    chat = next.chat
    deletingChat = next.deletingChat
    loading = next.loading
    initialPrompt = next.initialPrompt
    selectedAgentId = next.selectedAgentId
    enabledAgentList = next.enabledAgentList
    filteredConversationHistory = next.filteredConversationHistory
    selectedConversationId = next.selectedConversationId
    isLockedAgentMode = next.isLockedAgentMode
    showEmptyState = next.showEmptyState
    emptyStateMessage = next.emptyStateMessage
    selectedAgentName = next.selectedAgentName
    conversationStarters = next.conversationStarters
    agentAvailability = next.agentAvailability
    suppressAgentPicker = next.suppressAgentPicker
  }

  const unsubscribe = controller.subscribe(applyState)

  const handleDeleteChat = async () => {
    await controller.deleteCurrentChat()
  }

  const handleChatSaved = async (
    event: CustomEvent<{ chatId?: string; chat: ChatConversationLike }>
  ) => {
    await controller.handleChatSaved(event.detail)
  }

  const handleAgentSelected = async (
    event: CustomEvent<{ agentId: string }>
  ) => {
    if (lockedAgentId && event.detail.agentId !== lockedAgentId) {
      return
    }

    await controller.selectAgent(event.detail.agentId)
  }

  const handleConversationSelected = (
    event: CustomEvent<{ conversationId: string }>
  ) => {
    const conversation = filteredConversationHistory.find(
      convo => convo._id === event.detail.conversationId
    )

    if (conversation) {
      controller.selectConversation(conversation)
    }
  }

  const handleStartChat = async (
    event: CustomEvent<{ agentId: string; prompt: string }>
  ) => {
    await controller.startChat(event.detail.agentId, event.detail.prompt)
  }

  onMount(async () => {
    controller.setLockedAgentId(getLockedAgentIdFromCurrentPath())
    await controller.init(workspaceId)
  })

  onDestroy(() => {
    unsubscribe()
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
      hideAgents={isLockedAgentMode}
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
      {agentAvailability}
      {initialPrompt}
      {loading}
      {suppressAgentPicker}
      on:deleteChat={handleDeleteChat}
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
