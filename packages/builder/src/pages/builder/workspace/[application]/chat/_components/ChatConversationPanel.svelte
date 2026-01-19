<script lang="ts">
  import { Body, Button, Icon, ProgressCircle } from "@budibase/bbui"
  import type { ChatConversation, DraftChatConversation } from "@budibase/types"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import { createEventDispatcher } from "svelte"

  type ChatConversationLike = ChatConversation | DraftChatConversation

  type EnabledAgentListItem = {
    agentId: string
    name?: string
  }

  export let selectedAgentId: string | null = null
  export let selectedAgentName: string = ""
  export let enabledAgentList: EnabledAgentListItem[] = []

  export let chat: ChatConversationLike
  export let loading: boolean = false
  export let deletingChat: boolean = false
  export let workspaceId: string

  const dispatch = createEventDispatcher<{
    chatSaved: { chatId?: string; chat: ChatConversationLike }
    deleteChat: undefined
    agentSelected: { agentId: string }
  }>()

  const hasChatId = (value: ChatConversationLike) =>
    value && "_id" in value && Boolean(value._id)

  const deleteChat = () => {
    dispatch("deleteChat")
  }

  const selectAgent = (agentId: string) => {
    dispatch("agentSelected", { agentId })
  }
</script>

<div class="chat-wrapper">
  {#if selectedAgentId}
    <div class="chat-header">
      <div class="chat-header-agent">
        <Body size="S">
          {selectedAgentName || "Unknown agent"}
        </Body>
      </div>

      {#if hasChatId(chat)}
        <Button
          quiet
          warning
          disabled={deletingChat || loading}
          on:click={deleteChat}
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
      {workspaceId}
      on:chatSaved={event => dispatch("chatSaved", event.detail)}
    />
  {:else}
    <div class="chat-empty">
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        Choose an agent to start a chat
      </Body>
      <div class="chat-empty-grid">
        {#if enabledAgentList.length}
          {#each enabledAgentList as agent (agent.agentId)}
            <button
              class="chat-empty-card"
              on:click={() => selectAgent(agent.agentId)}
            >
              {agent.name || "Unknown agent"}
            </button>
          {/each}
        {:else}
          <Body size="S" color="var(--spectrum-global-color-gray-500)">
            No enabled agents
          </Body>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .chat-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    padding: 0 32px;
    box-sizing: border-box;
  }

  .chat-header {
    width: 100%;
    padding: var(--spacing-l) 0 var(--spacing-l);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    border-bottom: var(--border-light);
  }

  .chat-header-agent {
    display: flex;
    align-items: center;
  }

  .chat-header-agent :global(p) {
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0;
    font-weight: 400;
    color: white;
  }

  .delete-button-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .chat-empty {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-xxl);
    text-align: center;
  }

  .chat-empty-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--spacing-m);
    width: min(520px, 100%);
  }

  .chat-empty-card {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 12px;
    padding: var(--spacing-m);
    background: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-global-color-gray-800);
    font: inherit;
    cursor: pointer;
    text-align: center;
  }

  .chat-empty-card:hover {
    border-color: var(--spectrum-global-color-gray-300);
    background: var(--spectrum-global-color-gray-100);
  }
</style>
