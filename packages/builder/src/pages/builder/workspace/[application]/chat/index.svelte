<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { agentsStore, chatAppsStore } from "@/stores/portal"
  import {
    Body,
    Button,
    Icon,
    ProgressCircle,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import type {
    Agent,
    ChatConversation,
    ChatConversationRequest,
  } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onMount } from "svelte"
  import { Chatbox } from "@budibase/frontend-core/src/components"

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
  let autoSelected: boolean = false

  type ChatAppsStoreWithAgents = typeof chatAppsStore & {
    updateEnabledAgents: (enabledAgents: EnabledAgent[]) => Promise<unknown>
  }

  const chatAppsStoreWithAgents =
    chatAppsStore as unknown as ChatAppsStoreWithAgents

  $: conversationHistory = $chatAppsStore.conversations || []
  $: agents = $agentsStore.agents || []
  $: chatApp = ($chatAppsStore as ChatAppState).chatApp
  $: enabledAgents = chatApp?.enabledAgents || []

  const selectAgent = async (agentId: string | null) => {
    selectedAgentId = agentId
    if (agentId) {
      autoSelected = true
      await agentsStore.selectAgent(agentId)
      const chatApp = await chatAppsStore.ensureChatApp()
      if (!chatApp?._id) {
        return
      }
      chat = {
        ...INITIAL_CHAT,
        chatAppId: chatApp._id,
        agentId,
      }
      chatAppsStore.clearCurrentConversationId()
    } else {
      await agentsStore.selectAgent(undefined)
      chatAppsStore.reset()
      chat = { ...INITIAL_CHAT }
    }
  }

  const selectChat = async (selectedChat: ChatConversationWithAgent) => {
    autoSelected = true
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
        chat = {
          ...nextChat,
          chatAppId: nextChat.chatAppId || $chatAppsStore.chatAppId || "",
        }
        chatAppsStore.setCurrentConversationId(nextChat._id!)
      } else {
        chat = {
          ...INITIAL_CHAT,
          chatAppId: $chatAppsStore.chatAppId || "",
        }
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

  const startNewChat = async () => {
    const firstEnabledAgentId = getFirstEnabledAgentId(enabledAgents)
    if (!firstEnabledAgentId) {
      return
    }
    await selectAgent(firstEnabledAgentId)
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

  const getAgentOptionLabel = (agent: Agent) => agent.name || "Unnamed Agent"

  const getAgentName = (agentId: string) =>
    agents.find(agent => agent._id === agentId)?.name

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

    await chatAppsStoreWithAgents.updateEnabledAgents(nextEnabledAgents)
  }

  const maybeAutoSelect = async () => {
    if (autoSelected || selectedAgentId) {
      return
    }

    const firstEnabledAgentId = getFirstEnabledAgentId(enabledAgents)
    if (firstEnabledAgentId) {
      await selectAgent(firstEnabledAgentId)
      return
    }

    const fallbackAgent = agents.find(agent => agent._id)
    if (fallbackAgent?._id) {
      await handleAvailabilityToggle(fallbackAgent._id, true)
      await selectAgent(fallbackAgent._id)
    }
  }

  onMount(async () => {
    await agentsStore.init()
    await chatAppsStore.initConversations()

    const initialChat = $chatAppsStore.conversations[0]
    if (initialChat) {
      await selectChat(initialChat)
      return
    }

    await maybeAutoSelect()
  })

  $: if ($chatAppsStore.chatAppId && !autoSelected && !selectedAgentId) {
    void maybeAutoSelect()
  }
</script>

<div class="wrapper">
  <TopBar breadcrumbs={[{ text: "Chat" }]} icon="chat" showPublish={false} />
  <div class="page">
    <Panel customWidth={260} borderRight noHeaderBorder>
      <div class="settings-header">
        <Body size="S" color="var(--spectrum-global-color-gray-800)">
          Settings
        </Body>
      </div>
      <div class="settings-section">
        <Body size="S" color="var(--spectrum-global-color-gray-700)">
          Agents
        </Body>
        {#if agents.length}
          {#each agents as agent (agent._id)}
            <div class="settings-agent">
              <div class="settings-agent-info">
                <Body size="S">{getAgentOptionLabel(agent)}</Body>
              </div>
              {#if agent._id}
                <Toggle
                  value={isAgentAvailable(agent._id)}
                  on:change={event =>
                    handleAvailabilityToggle(agent._id!, event.detail)}
                />
              {/if}
            </div>
          {/each}
        {:else}
          <Body size="S" color="var(--spectrum-global-color-gray-500)">
            No agents found
          </Body>
        {/if}
      </div>
    </Panel>

    <Panel customWidth={260} borderRight noHeaderBorder>
      <div class="list-section">
        <div class="list-title">Agents</div>
        {#if enabledAgentList.length}
          {#each enabledAgentList as agent (agent.agentId)}
            <button
              class="list-item list-item-button"
              on:click={() => selectAgent(agent.agentId)}
            >
              {agent.name}
            </button>
          {/each}
        {:else}
          <Body size="XS" color="var(--spectrum-global-color-gray-500)">
            No agents
          </Body>
        {/if}
      </div>
      <div class="list-section">
        <div class="list-title">Recent Chats</div>
        {#if conversationHistory.length}
          {#each conversationHistory as conversation}
            <button
              class="list-item list-item-button"
              class:selected={$chatAppsStore.currentConversationId ===
                conversation._id}
              on:click={() => selectChat(conversation)}
            >
              {conversation.title || "Untitled Chat"}
            </button>
          {/each}
        {:else}
          <Body size="XS" color="var(--spectrum-global-color-gray-500)">
            No recent chats
          </Body>
        {/if}
      </div>
    </Panel>

    <div class="chat-wrapper">
      <div class="chat-header">
        <div class="chat-header-agent">
          <Body size="S" color="var(--spectrum-global-color-gray-700)">
            {getAgentName(selectedAgentId || "") || "Unknown agent"}
          </Body>
        </div>
        {#if chat._id}
          <Button
            quiet
            warning
            disabled={deletingChat || loading}
            on:click={deleteCurrentChat}
          >
            <span class="delete-button-content">
              {#if deletingChat}
                <ProgressCircle size="S" />
                Deleting...
              {:else}
                <Icon name="trash" size="S" />
                Delete chat
              {/if}
            </span>
          </Button>
        {/if}
      </div>

      <Chatbox
        bind:chat
        {loading}
        workspaceId={$params.application}
        on:chatSaved={handleChatSaved}
      />
    </div>
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

  .chat-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .chat-header {
    width: 600px;
    max-width: 100%;
    margin: 0 auto;
    padding: var(--spacing-l) 0 var(--spacing-s);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .chat-header-agent {
    display: flex;
    align-items: center;
  }

  .delete-button-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .list-section {
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
  }

  .list-section + .list-section {
    padding-top: 0;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    background: transparent;
    border: none;
    padding: var(--spacing-xs) 0;
    font: inherit;
    color: var(--spectrum-global-color-gray-700);
    text-align: left;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .list-item-button {
    cursor: pointer;
  }

  .list-item-button:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .list-item.selected {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 600;
  }

  .list-item-action {
    color: var(--spectrum-global-color-gray-700);
  }

  .list-title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--spectrum-global-color-gray-500);
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
  }

  .list-item-action span {
    padding-top: 1px;
  }

  .settings-header {
    padding: var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .settings-section {
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .settings-agent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .settings-agent-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
  }
</style>
