<script lang="ts">
  import NavHeader from "@/components/common/NavHeader.svelte"
  import NavItem from "@/components/common/NavItem.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { agentsStore } from "@/stores/portal"
  import { Body, Icon, Select } from "@budibase/bbui"
  import type { AgentChat } from "@budibase/types"
  import { params } from "@roxi/routify"
  import { onMount } from "svelte"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import type { Agent } from "@budibase/types"

  const INITIAL_CHAT: Omit<AgentChat, "_id" | "_rev"> = {
    title: "",
    messages: [],
  }
  const NO_MESSAGES_TEXT = "No messages"
  const NO_PREVIEW_TEXT = "No preview available"

  let chat: AgentChat = { ...INITIAL_CHAT }
  let loading: boolean = false
  let selectedAgentId: string | null = null

  $: chatHistory = $agentsStore.chats || []
  $: agents = $agentsStore.agents || []

  const selectAgent = async (agentId: string | null) => {
    selectedAgentId = agentId
    if (agentId) {
      agentsStore.selectAgent(agentId)
      await agentsStore.fetchChats(agentId)
      chat = { ...INITIAL_CHAT, agentId }
      agentsStore.clearCurrentChatId()
    } else {
      agentsStore.selectAgent(undefined)
      chat = { ...INITIAL_CHAT }
    }
  }

  const selectChat = async (selectedChat: AgentChat) => {
    chat = { ...selectedChat, agentId: selectedAgentId || undefined }
    agentsStore.setCurrentChatId(selectedChat._id!)
  }

  const startNewChat = () => {
    if (!selectedAgentId) return
    chat = { ...INITIAL_CHAT, agentId: selectedAgentId }
    agentsStore.clearCurrentChatId()
  }

  const getChatPreview = (chat: AgentChat): string => {
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

  const handleChatSaved = async (event: CustomEvent<{ chatId: string }>) => {
    const { chatId } = event.detail
    if (chatId && selectedAgentId) {
      agentsStore.setCurrentChatId(chatId)
      await agentsStore.fetchChats(selectedAgentId)
    }
  }

  const handleAgentChange = (event: CustomEvent<string>) => {
    selectAgent(event.detail || null)
  }

  const getAgentOptionValue = (agent: Agent) => agent._id!
  const getAgentOptionLabel = (agent: Agent) => agent.name || "Unnamed Agent"

  onMount(async () => {
    await agentsStore.init()

    selectedAgentId = $agentsStore.agents[0]._id || null

    if (selectedAgentId) {
      await agentsStore.fetchChats(selectedAgentId)
      chat = $agentsStore.chats[0] || { ...INITIAL_CHAT }
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
            selected={$agentsStore.currentChatId === chatItem._id}
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
