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
  import type { ChatConversation } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onMount } from "svelte"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import type { Agent } from "@budibase/types"

  const INITIAL_CHAT: Omit<ChatConversation, "_id" | "_rev"> = {
    title: "",
    messages: [],
    chatAppId: "",
  }
  const NO_MESSAGES_TEXT = "No messages"
  const NO_PREVIEW_TEXT = "No preview available"

  let chat: ChatConversation = { ...INITIAL_CHAT }
  let loading: boolean = false
  let deletingChat: boolean = false
  let selectedAgentId: string | null = null

  $: chatHistory = $chatAppsStore.chats || []
  $: agents = $agentsStore.agents || []

  const selectAgent = async (agentId: string | null) => {
    selectedAgentId = agentId
    const workspaceId = $params?.application
    if (agentId) {
      await agentsStore.selectAgent(agentId, workspaceId)
      const chatApp = await chatAppsStore.selectChatAppForAgent(
        agentId,
        workspaceId
      )
      const resolvedChatAppId = chatApp?._id || agentId
      chat = { ...INITIAL_CHAT, agentId, chatAppId: resolvedChatAppId }
      chatAppsStore.clearCurrentChatId()
    } else {
      await agentsStore.selectAgent(undefined, workspaceId)
      chatAppsStore.reset(workspaceId)
      chat = { ...INITIAL_CHAT }
    }
  }

  const selectChat = async (selectedChat: ChatConversation) => {
    chat = {
      ...selectedChat,
      agentId: selectedAgentId || selectedChat.agentId,
      chatAppId:
        selectedChat.chatAppId ||
        $chatAppsStore.chatAppId ||
        selectedAgentId ||
        "",
    }
    chatAppsStore.setCurrentChatId(selectedChat._id!)
  }

  const deleteCurrentChat = async () => {
    if (!selectedAgentId || !chat?._id || deletingChat) {
      return
    }

    deletingChat = true

    try {
      await chatAppsStore.removeChat(chat._id, $chatAppsStore.chatAppId)
      const remainingChats = $chatAppsStore.chats
      if (remainingChats.length) {
        const [nextChat] = remainingChats
        chat = {
          ...nextChat,
          agentId: selectedAgentId,
          chatAppId: nextChat.chatAppId || selectedAgentId,
        }
        chatAppsStore.setCurrentChatId(nextChat._id!)
      } else {
        chat = {
          ...INITIAL_CHAT,
          agentId: selectedAgentId,
          chatAppId: $chatAppsStore.chatAppId || selectedAgentId,
        }
        chatAppsStore.clearCurrentChatId()
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
      agentId: selectedAgentId,
      chatAppId: $chatAppsStore.chatAppId || selectedAgentId,
    }
    chatAppsStore.clearCurrentChatId()
  }

  const getChatPreview = (chat: ChatConversation): string => {
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
    event: CustomEvent<{ chatId?: string; chat: ChatConversation }>
  ) => {
    if (!selectedAgentId) {
      return
    }

    const { chatId, chat: savedChat } = event.detail
    const updatedChats = await chatAppsStore.fetchChats(
      $chatAppsStore.chatAppId
    )
    const lastMessageId = savedChat.messages[savedChat.messages.length - 1]?.id

    const newCurrentChat =
      updatedChats.find(chatItem => chatItem._id === chatId) ||
      (lastMessageId
        ? updatedChats.find(chatItem =>
            chatItem.messages?.some(message => message.id === lastMessageId)
          )
        : undefined)

    if (!newCurrentChat?._id) {
      return
    }

    chat = {
      ...newCurrentChat,
      agentId: newCurrentChat.agentId || selectedAgentId,
      chatAppId:
        newCurrentChat.chatAppId ||
        $chatAppsStore.chatAppId ||
        selectedAgentId ||
        "",
    }
    chatAppsStore.setCurrentChatId(newCurrentChat._id)
  }

  const handleAgentChange = (event: CustomEvent<string>) => {
    selectAgent(event.detail || null)
  }

  const getAgentOptionValue = (agent: Agent) => agent._id!
  const getAgentOptionLabel = (agent: Agent) => agent.name || "Unnamed Agent"

  onMount(async () => {
    await agentsStore.init()

    const initialAgentId = $agentsStore.agents[0]?._id
    if (!initialAgentId) {
      return
    }

    await selectAgent(initialAgentId)

    const initialChat = $chatAppsStore.chats[0]
    if (initialChat) {
      chat = {
        ...initialChat,
        agentId: initialChat.agentId || initialAgentId,
        chatAppId:
          initialChat.chatAppId || $chatAppsStore.chatAppId || initialAgentId,
      }
      chatAppsStore.setCurrentChatId(initialChat._id!)
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

        {#each chatHistory as chatItem}
          <NavItem
            text={chatItem.title || "Untitled Chat"}
            subtext={getChatPreview(chatItem)}
            on:click={() => selectChat(chatItem)}
            selected={$chatAppsStore.currentChatId === chatItem._id}
            withActions={false}
          />
        {/each}
        {#if !chatHistory.length}
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
