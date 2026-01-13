<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import ChatConversationPanel from "./_components/ChatConversationPanel.svelte"
  import ChatNavigationPanel from "./_components/ChatNavigationPanel.svelte"
  import ChatSettingsPanel from "./_components/ChatSettingsPanel.svelte"
  import { agentsStore, chatAppsStore } from "@/stores/portal"
  import { notifications } from "@budibase/bbui"
  import type {
    ChatConversation,
    ChatConversationRequest,
  } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onMount } from "svelte"

  type ChatConversationWithAgent = ChatConversation & { agentId?: string }
  type ChatConversationRequestWithAgent = ChatConversationRequest & {
    agentId?: string
  }
  type ChatConversationLike =
    | ChatConversationWithAgent
    | ChatConversationRequestWithAgent

  const INITIAL_CHAT: Omit<ChatConversationRequestWithAgent, "_id" | "_rev"> = {
    title: "",
    messages: [],
    chatAppId: "",
    agentId: "",
  }

  type EnabledAgent = { agentId: string }
  type ChatAppState = { chatApp?: { enabledAgents?: EnabledAgent[] } }

  let chat: ChatConversationLike = { ...INITIAL_CHAT }
  let loading: boolean = false
  let deletingChat: boolean = false
  let selectedAgentId: string | null = null
  let selectedAgentName: string = ""
  let initializedWorkspaceId: string | null = null

  $: conversationHistory = $chatAppsStore.conversations || []
  $: agents = $agentsStore.agents || []
  $: namedAgents = agents.filter(agent => Boolean(agent?.name))
  $: chatApp = ($chatAppsStore as ChatAppState).chatApp
  $: enabledAgents = chatApp?.enabledAgents || []

  const selectAgent = async (agentId: string | null) => {
    if (agentId) {
      const chatApp = await chatAppsStore.ensureChatApp(
        agentId,
        $params.application
      )
      if (!chatApp?._id) {
        notifications.error("Could not start chat")
        return
      }

      selectedAgentId = agentId
      await agentsStore.selectAgent(agentId)
      chat = {
        ...INITIAL_CHAT,
        chatAppId: chatApp._id,
        agentId,
      }
      chatAppsStore.clearCurrentConversationId()
      return
    }

    selectedAgentId = null
    await agentsStore.selectAgent(undefined)
    chatAppsStore.reset()
    chat = { ...INITIAL_CHAT }
  }

  const selectChat = async (selectedChat: ChatConversationWithAgent) => {
    const resolvedAgentId =
      selectedChat.agentId || getFirstEnabledAgentId(enabledAgents)
    if (!resolvedAgentId) {
      return
    }
    selectedAgentId = resolvedAgentId
    await agentsStore.selectAgent(resolvedAgentId)
    chat = {
      ...selectedChat,
      agentId: resolvedAgentId,
      chatAppId: selectedChat.chatAppId || $chatAppsStore.chatAppId || "",
    }
    chatAppsStore.setCurrentConversationId(selectedChat._id!)
  }

  const deleteCurrentChat = async () => {
    if (!selectedAgentId || !chat?._id || deletingChat) {
      return
    }

    deletingChat = true

    try {
      await chatAppsStore.removeConversation(chat._id, $chatAppsStore.chatAppId)
      const remainingConversations = $chatAppsStore.conversations
      if (remainingConversations.length) {
        const [nextChat] = remainingConversations
        await selectChat(nextChat)
      } else {
        // Return to blank state (no agent selected)
        selectedAgentId = null
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

  const getFirstEnabledAgentId = (agentsList: EnabledAgent[]) =>
    agentsList[0]?.agentId || null

  const getAgentName = (agentId: string) =>
    agents.find(agent => agent._id === agentId)?.name

  $: selectedAgentName = selectedAgentId
    ? getAgentName(selectedAgentId) || "Unknown agent"
    : ""

  const initChatApp = async (workspaceId: string) => {
    if (!workspaceId || initializedWorkspaceId === workspaceId) {
      return
    }

    // Switching applications/workspaces: clear any stale chat state first.
    initializedWorkspaceId = workspaceId
    selectedAgentId = null
    chat = { ...INITIAL_CHAT }
    chatAppsStore.reset()
    await agentsStore.selectAgent(undefined)

    await chatAppsStore.initConversations(undefined, workspaceId)
  }

  $: if ($params.application) {
    initChatApp($params.application)
  }
  $: enabledAgentList = enabledAgents
    .map(agent => ({
      agentId: agent.agentId,
      name: getAgentName(agent.agentId),
    }))
    .filter(agent => Boolean(agent.name))

  const isAgentAvailable = (agentId: string) =>
    enabledAgents.some((agent: EnabledAgent) => agent.agentId === agentId)

  const handleAvailabilityToggle = async (
    agentId: string,
    enabled: boolean
  ) => {
    if (!agentId) {
      return
    }

    if (enabled && isAgentAvailable(agentId)) {
      return
    }

    if (!enabled && !isAgentAvailable(agentId)) {
      return
    }

    const current = enabledAgents
    let nextEnabledAgents: EnabledAgent[] = []

    if (enabled) {
      nextEnabledAgents = [...current, { agentId }]
    } else {
      nextEnabledAgents = current.filter(agent => agent.agentId !== agentId)
      if (!nextEnabledAgents.length) {
        notifications.error("At least one agent must remain enabled")
        return
      }
      if (selectedAgentId === agentId) {
        const fallbackAgentId = nextEnabledAgents[0]?.agentId
        await selectAgent(fallbackAgentId || null)
      }
    }

    await chatAppsStore.updateEnabledAgents(nextEnabledAgents)
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

<div class="wrapper">
  <TopBar breadcrumbs={[{ text: "Chat" }]} icon="chat" showPublish={false} />
  <div class="page">
    <ChatSettingsPanel
      {namedAgents}
      {isAgentAvailable}
      {handleAvailabilityToggle}
    />

    <ChatNavigationPanel
      {enabledAgentList}
      {conversationHistory}
      selectedConversationId={$chatAppsStore.currentConversationId}
      on:agentSelected={handleAgentSelected}
      on:conversationSelected={handleConversationSelected}
    />

    <ChatConversationPanel
      bind:chat
      {loading}
      {deletingChat}
      {enabledAgentList}
      {selectedAgentId}
      {selectedAgentName}
      workspaceId={$params.application}
      on:deleteChat={deleteCurrentChat}
      on:chatSaved={handleChatSaved}
      on:agentSelected={handleAgentSelected}
    />
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
  }

  .page {
    flex: 1 1 auto;
    display: flex;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
    flex-direction: row;
    height: 0;
    width: 100%;
    align-items: stretch;
  }
</style>
