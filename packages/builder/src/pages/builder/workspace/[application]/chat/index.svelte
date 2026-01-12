<script lang="ts">
  import TopBar from "@/components/common/TopBar.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { agentsStore, chatAppsStore } from "@/stores/portal"
  import {
    Body,
    Button,
    Icon,
    ProgressCircle,
    Select,
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

  type ChatConversationLike = ChatConversation | ChatConversationRequest

  const INITIAL_CHAT: Omit<ChatConversationRequest, "_id" | "_rev"> = {
    title: "",
    messages: [],
    chatAppId: "",
  }

  type EnabledAgent = { agentId: string; isDefault?: boolean }
  type ChatAppState = { chatApp?: { enabledAgents?: EnabledAgent[] } }

  let chat: ChatConversationLike = { ...INITIAL_CHAT }
  let loading: boolean = false
  let deletingChat: boolean = false
  let selectedAgentId: string | null = null

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
      await agentsStore.selectAgent(agentId)
      await chatAppsStore.ensureChatApp(agentId)
      if (!chat.chatAppId && $chatAppsStore.chatAppId) {
        chat = { ...chat, chatAppId: $chatAppsStore.chatAppId }
      }
    } else {
      await agentsStore.selectAgent(undefined)
      chatAppsStore.reset()
      chat = { ...INITIAL_CHAT }
    }
  }

  const selectChat = async (selectedChat: ChatConversation) => {
    chat = {
      ...selectedChat,
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

  const startNewChat = () => {
    if (!selectedAgentId) return
    chat = {
      ...INITIAL_CHAT,
      chatAppId: $chatAppsStore.chatAppId || "",
    }
    chatAppsStore.clearCurrentConversationId()
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

  const handleAgentChange = (event: CustomEvent<string>) => {
    selectAgent(event.detail || null)
  }

  const getAgentOptionValue = (agent: Agent) => agent._id!
  const getAgentOptionLabel = (agent: Agent) => agent.name || "Unnamed Agent"
  const getDefaultAgentId = (agentsList: EnabledAgent[]) =>
    agentsList.find((agent: EnabledAgent) => agent.isDefault)?.agentId ||
    agentsList[0]?.agentId ||
    null

  const getAgentName = (agentId: string) =>
    agents.find(agent => agent._id === agentId)?.name || "Unknown agent"

  const isAgentAvailable = (agentId: string) =>
    enabledAgents.some((agent: EnabledAgent) => agent.agentId === agentId)

  const isDefaultAgent = (agentId: string) =>
    enabledAgents.some(
      (agent: EnabledAgent) => agent.agentId === agentId && agent.isDefault
    )

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
      const hasDefault = current.some(agent => agent.isDefault)
      nextEnabledAgents = [...current, { agentId, isDefault: !hasDefault }]
    } else {
      nextEnabledAgents = current.filter(agent => agent.agentId !== agentId)
      if (!nextEnabledAgents.length) {
        notifications.error("At least one agent must remain enabled")
        return
      }
      if (!nextEnabledAgents.some(agent => agent.isDefault)) {
        nextEnabledAgents = nextEnabledAgents.map((agent, index) => ({
          ...agent,
          isDefault: index === 0,
        }))
      }
      if (selectedAgentId === agentId) {
        const fallbackAgentId =
          nextEnabledAgents.find(agent => agent.isDefault)?.agentId ||
          nextEnabledAgents[0]?.agentId
        await selectAgent(fallbackAgentId || null)
      }
    }

    await chatAppsStoreWithAgents.updateEnabledAgents(nextEnabledAgents)
  }

  onMount(async () => {
    await agentsStore.init()
    await chatAppsStore.initConversations()
    let initialAgentId = getDefaultAgentId(enabledAgents)
    if (!initialAgentId) {
      const fallbackAgent = agents.find(agent => agent._id)
      if (fallbackAgent?._id) {
        await handleAvailabilityToggle(fallbackAgent._id, true)
        initialAgentId = fallbackAgent._id
      } else {
        return
      }
    }

    await selectAgent(initialAgentId)

    const initialChat = $chatAppsStore.conversations[0]
    if (initialChat) {
      chat = {
        ...initialChat,
        chatAppId: initialChat.chatAppId || $chatAppsStore.chatAppId || "",
      }
      chatAppsStore.setCurrentConversationId(initialChat._id!)
    }
  })
</script>

<div class="wrapper">
  <TopBar breadcrumbs={[{ text: "Chat" }]} icon="chat" showPublish={false}>
    <div class="agent-selector">
      <Select
        placeholder="Select an agent"
        value={selectedAgentId || undefined}
        options={agents}
        getOptionValue={getAgentOptionValue}
        getOptionLabel={getAgentOptionLabel}
        on:change={handleAgentChange}
      />
    </div>
  </TopBar>
  <div class="page">
    {#if selectedAgentId}
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
                  {#if agent._id && isDefaultAgent(agent._id)}
                    <Body
                      size="XS"
                      color="var(--spectrum-global-color-gray-500)"
                    >
                      Default
                    </Body>
                  {/if}
                </div>
                {#if agent._id && !isDefaultAgent(agent._id)}
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
        <div class="list-section list-actions">
          <button
            class="list-item list-item-button list-item-action"
            on:click={startNewChat}
          >
            <Icon name="plus" size="S" />
            <span>New chat</span>
          </button>
        </div>
        <div class="list-section">
          <div class="list-title">Agents</div>
          {#if enabledAgents.length}
            {#each enabledAgents as agent (agent.agentId)}
              {#if !agent.isDefault}
                <div class="list-item">{getAgentName(agent.agentId)}</div>
              {/if}
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
        {#if chat._id}
          <div class="chat-header">
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
          </div>
        {/if}
        <Chatbox
          bind:chat
          {loading}
          workspaceId={$params.application}
          on:chatSaved={handleChatSaved}
        />
      </div>
    {:else}
      <div class="empty-state-container">
        <div class="empty-state">
          <Icon
            name="chat"
            size="XL"
            color="var(--spectrum-global-color-gray-400)"
          />
          <Body size="M" color="var(--spectrum-global-color-gray-700)">
            Select an agent to start chatting
          </Body>
          <Body size="S" color="var(--spectrum-global-color-gray-600)">
            Choose an agent from the dropdown above to begin a conversation
          </Body>
        </div>
      </div>
    {/if}
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

  .delete-button-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .agent-selector {
    min-width: 200px;
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

  .list-actions {
    padding-bottom: var(--spacing-s);
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

  .empty-state-container {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xxl);
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-m);
    text-align: center;
  }

  .empty-state :global(p) {
    margin: 0;
  }
</style>
