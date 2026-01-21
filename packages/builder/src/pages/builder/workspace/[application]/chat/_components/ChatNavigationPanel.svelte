<script lang="ts">
  import Panel from "@/components/design/Panel.svelte"
  import { Body, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  type EnabledAgentListItem = {
    agentId: string
    name?: string
    default?: boolean
  }

  type ConversationListItem = {
    _id?: string
    title?: string
  }

  export let enabledAgentList: EnabledAgentListItem[] = []
  export let conversationHistory: ConversationListItem[] = []
  export let selectedConversationId: string | undefined

  $: defaultAgent =
    enabledAgentList.find(agent => agent.default) || enabledAgentList[0]

  const dispatch = createEventDispatcher<{
    agentSelected: { agentId: string }
    conversationSelected: { conversationId: string }
  }>()

  const selectAgent = (agentId: string) => {
    dispatch("agentSelected", { agentId })
  }

  const selectConversation = (conversationId: string) => {
    dispatch("conversationSelected", { conversationId })
  }
</script>

<div class="chat-nav-panel">
  <Panel customWidth={260} borderRight noHeaderBorder>
    <div class="chat-nav-content">
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
            {#if conversation._id}
              <button
                class="list-item list-item-button"
                class:selected={selectedConversationId === conversation._id}
                on:click={() => selectConversation(conversation._id!)}
              >
                {conversation.title || "Untitled Chat"}
              </button>
            {/if}
          {/each}
        {:else}
          <Body size="XS" color="var(--spectrum-global-color-gray-500)">
            No recent chats
          </Body>
        {/if}
      </div>
    </div>
  </Panel>
</div>

<style>
  .chat-nav-panel {
    display: flex;
  }

  .chat-nav-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  :global(.chat-nav-panel .panel) {
    background: transparent;
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
    background: #6a9bcc;
    color: var(--spectrum-global-color-gray-50);
  }

  .new-chat-label {
    font-size: 14px;
    color: var(--spectrum-global-color-gray-800);
  }

  .new-chat:hover .new-chat-icon {
    background: #5c8dbf;
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

  .list-title {
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0;
    color: var(--spectrum-global-color-gray-600);
    font-weight: 400;
    margin-bottom: var(--spacing-xs);
  }
</style>
