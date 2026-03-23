<script lang="ts">
  import { ActionMenu, Body, Icon, MenuItem } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  type EnabledAgentListItem = {
    agentId: string
    name?: string
    isDefault?: boolean
    icon?: string
    iconColor?: string
  }

  type ConversationListItem = {
    _id?: string
    title?: string
  }

  type ConversationWithId = ConversationListItem & {
    _id: string
  }

  export let enabledAgentList: EnabledAgentListItem[] = []
  export let conversationHistory: ConversationListItem[] = []
  export let selectedConversationId: string | undefined
  export let selectedAgentName: string | undefined
  export let hideAgents = false
  export let deletingChat = false

  $: defaultAgent =
    enabledAgentList.find(agent => agent.isDefault) || enabledAgentList[0]

  $: conversationsWithId = conversationHistory.filter(
    (conversation): conversation is ConversationWithId =>
      Boolean(conversation._id)
  )

  const dispatch = createEventDispatcher<{
    agentSelected: { agentId: string }
    conversationSelected: { conversationId: string }
    conversationDeleted: { conversationId: string }
  }>()

  const selectAgent = (agentId: string) => {
    dispatch("agentSelected", { agentId })
  }

  const selectConversation = (conversationId: string) => {
    dispatch("conversationSelected", { conversationId })
  }

  const deleteConversation = (conversationId: string) => {
    dispatch("conversationDeleted", { conversationId })
  }
</script>

<div class="chat-nav-shell">
  <div class="chat-nav-content">
    {#if selectedAgentName}
      <div class="list-section current-agent-section">
        <div class="current-agent-name">{selectedAgentName}</div>
      </div>
    {/if}

    {#if defaultAgent?.agentId}
      <div class="list-section">
        <button
          class="new-chat"
          on:click={() => selectAgent(defaultAgent.agentId)}
        >
          <span class="new-chat-icon">
            <Icon name="plus" size="S" />
          </span>
          <span class="new-chat-label">New chat</span>
        </button>
      </div>
    {/if}

    {#if !hideAgents}
      <div class="list-section">
        <div class="list-title">Agents</div>
        {#if enabledAgentList.length}
          {#each enabledAgentList as agent (agent.agentId)}
            <button
              class="list-item list-item-button"
              on:click={() => selectAgent(agent.agentId)}
            >
              <span class="list-item-icon">
                <Icon name={agent.icon || "robot"} size="S" />
              </span>
              {agent.name}
            </button>
          {/each}
        {:else}
          <Body size="XS" color="var(--spectrum-global-color-gray-500)">
            No agents
          </Body>
        {/if}
      </div>
    {/if}

    <div class="list-section">
      <div class="list-title">Recent Chats</div>
      {#if conversationsWithId.length}
        {#each conversationsWithId as conversation (conversation._id)}
          <div
            class="conversation-row"
            class:selected={selectedConversationId === conversation._id}
          >
            <button
              class="list-item list-item-button conversation-button"
              on:click={() => selectConversation(conversation._id)}
            >
              <span class="conversation-title">
                {conversation.title || "Untitled Chat"}
              </span>
            </button>

            <ActionMenu align="right" disabled={deletingChat}>
              <button
                slot="control"
                class="conversation-actions"
                type="button"
                aria-label={`Open actions for ${
                  conversation.title || "Untitled Chat"
                }`}
              >
                <Icon size="S" name="dots-three" />
              </button>
              <MenuItem
                on:click={() => selectConversation(conversation._id)}
                icon="chat-circle"
              >
                View chat
              </MenuItem>
              <MenuItem
                on:click={() => deleteConversation(conversation._id)}
                icon="trash"
                disabled={deletingChat}
              >
                {deletingChat ? "Deleting..." : "Delete chat"}
              </MenuItem>
            </ActionMenu>
          </div>
        {/each}
      {:else}
        <Body size="XS" color="var(--spectrum-global-color-gray-500)">
          No recent chats
        </Body>
      {/if}
    </div>
  </div>
</div>

<style>
  .chat-nav-shell {
    display: flex;
    width: 260px;
    min-width: 260px;
    border-right: var(--border-light);
    background: transparent;
  }

  .chat-nav-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    width: 100%;
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

  .current-agent-section {
    padding-bottom: var(--spacing-m);
  }

  .current-agent-name {
    font-size: 14px;
    line-height: 17px;
    color: var(--spectrum-global-color-gray-800);
    padding: var(--spacing-xs) 0;
  }

  .new-chat {
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
    cursor: pointer;
  }

  .new-chat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--spectrum-semantic-cta-color-background-default);
    color: var(--spectrum-global-color-gray-50);
  }

  .new-chat-label {
    font-size: 14px;
    color: var(--spectrum-global-color-gray-800);
  }

  .new-chat:hover .new-chat-icon {
    background: var(--spectrum-semantic-cta-color-background-hover);
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

  .conversation-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-xxs);
    min-width: 0;
  }

  .conversation-button {
    flex: 1 1 auto;
    min-width: 0;
  }

  .conversation-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .conversation-actions {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--spectrum-global-color-gray-600);
    cursor: pointer;
    flex: 0 0 auto;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 120ms ease,
      color 120ms ease;
  }

  .conversation-row:hover .conversation-actions,
  .conversation-row:focus-within .conversation-actions {
    opacity: 1;
    pointer-events: auto;
  }

  .conversation-actions:hover,
  .conversation-actions:focus-visible {
    color: var(--spectrum-global-color-gray-900);
  }

  .conversation-actions:disabled {
    cursor: default;
    opacity: 0.5;
    pointer-events: none;
  }

  .list-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .list-item-button {
    cursor: pointer;
  }

  .list-item-button:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .list-item.selected,
  .conversation-row.selected .list-item {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 600;
  }

  .conversation-row.selected .conversation-actions {
    color: var(--spectrum-global-color-gray-900);
  }

  .list-title {
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0;
    color: var(--spectrum-global-color-gray-600);
    font-weight: 400;
    margin-bottom: var(--spacing-xs);
  }
</style>
