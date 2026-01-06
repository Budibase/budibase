<script lang="ts">
  import NavHeader from "@/components/common/NavHeader.svelte"
  import NavItem from "@/components/common/NavItem.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { agentsStore, chatAppsStore } from "@/stores/portal"
  import {
    Body,
    Button,
    Icon,
    ProgressCircle,
    Select,
    notifications,
  } from "@budibase/bbui"
  import type {
    ChatConversation,
    ChatConversationRequest,
  } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onMount } from "svelte"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import type { Agent } from "@budibase/types"

  type ChatConversationLike = ChatConversation | ChatConversationRequest

  const INITIAL_CHAT: Omit<ChatConversationRequest, "_id" | "_rev"> = {
    title: "",
    messages: [],
    chatAppId: "",
  }
  const NO_MESSAGES_TEXT = "No messages"
  const NO_PREVIEW_TEXT = "No preview available"

  let chat: ChatConversationLike = { ...INITIAL_CHAT }
  let loading: boolean = false
  let deletingChat: boolean = false
  let selectedAgentId: string | null = null

  $: conversationHistory = $chatAppsStore.conversations || []
  $: agents = $agentsStore.agents || []

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

  const getChatPreview = (chat: ChatConversationLike): string => {
    const messageCount = chat.messages.length
    if (!messageCount) {
      return NO_MESSAGES_TEXT
    }

    let lastMessage = chat.messages[messageCount - 1].parts
    const msg = lastMessage.some(part => part.type === "text")
      ? lastMessage
          .filter(part => part.type === "text")
          .map(part => part.text)
          .join("")
      : NO_PREVIEW_TEXT
    return typeof msg === "string" ? msg : NO_PREVIEW_TEXT
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

  onMount(async () => {
    await agentsStore.init()
    const chatApp = await chatAppsStore.initConversations()
    const initialAgentId = chatApp?.agentId
    if (!initialAgentId) {
      return
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
        <NavHeader
          slot="panel-title-content"
          title="Chats"
          onAdd={startNewChat}
          searchable={false}
        />

        {#each conversationHistory as conversation}
          <NavItem
            text={conversation.title || "Untitled Chat"}
            subtext={getChatPreview(conversation)}
            on:click={() => selectChat(conversation)}
            selected={$chatAppsStore.currentConversationId === conversation._id}
            withActions={false}
          />
        {/each}
        {#if !conversationHistory.length}
          <div class="empty-state">
            <Body size="S">
              No chat history yet.<br />
              Start a new conversation!
            </Body>
          </div>
        {/if}
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
