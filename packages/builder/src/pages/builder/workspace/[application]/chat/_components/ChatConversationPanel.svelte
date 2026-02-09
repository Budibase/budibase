<script lang="ts">
  import { Body, Button, Icon, ProgressCircle } from "@budibase/bbui"
  import type { ChatConversation, DraftChatConversation } from "@budibase/types"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import { createEventDispatcher } from "svelte"

  type ChatConversationLike = ChatConversation | DraftChatConversation

  type EnabledAgentListItem = {
    agentId: string
    name?: string
    icon?: string
    iconColor?: string
  }

  export let selectedAgentId: string | null = null
  export let selectedAgentName: string = ""
  export let enabledAgentList: EnabledAgentListItem[] = []
  export let conversationStarters: { prompt: string }[] = []
  export let isAgentKnown: boolean = true
  export let isAgentLive: boolean = true

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

  let readOnlyReason: "disabled" | "deleted" | "offline" | undefined

  $: visibleAgentList = enabledAgentList.slice(0, 3)

  $: isAgentEnabled = selectedAgentId
    ? enabledAgentList.some(agent => agent.agentId === selectedAgentId)
    : false
  $: readOnlyReason = selectedAgentId
    ? !isAgentKnown
      ? "deleted"
      : !isAgentLive
        ? "offline"
        : !isAgentEnabled
          ? "disabled"
          : undefined
    : undefined

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
      {workspaceId}
      {conversationStarters}
      readOnly={Boolean(readOnlyReason)}
      {readOnlyReason}
      onchatsaved={event => dispatch("chatSaved", event.detail)}
    />
  {:else}
    <div class="chat-empty">
      <Body size="S" color="var(--spectrum-global-color-gray-700)">
        Choose an agent to start a chat
      </Body>
      <div class="chat-empty-grid">
        {#if visibleAgentList.length}
          {#each visibleAgentList as agent (agent.agentId)}
            <button
              class="chat-empty-card"
              on:click={() => selectAgent(agent.agentId)}
              style={`--agent-icon-color:${agent.iconColor || "#6366F1"};`}
            >
              <div class="chat-empty-card-head">
                <div class="chat-empty-card-icon">
                  <Icon
                    name={agent.icon || "SideKick"}
                    size="S"
                    color="var(--agent-icon-color)"
                  />
                </div>
                <Body size="S" weight="500">
                  {agent.name || "Unknown agent"}
                </Body>
              </div>
              <div class="chat-empty-card-subtitle">
                <Body size="XS" color="var(--spectrum-global-color-gray-600)">
                  Start a chat with this agent.
                </Body>
              </div>
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
    padding: 0 32px 32px 32px;
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
    gap: var(--spacing-xl);
    padding: var(--spacing-xxl);
    text-align: center;
  }

  .chat-empty-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-m);
    width: min(720px, 100%);
  }

  .chat-empty-card {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 16px;
    padding: 0;
    background: var(--spectrum-alias-background-color-primary);
    color: var(--spectrum-global-color-gray-800);
    font: inherit;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    transition:
      border-color 150ms ease,
      transform 150ms ease;
  }

  .chat-empty-card:hover {
    border-color: var(--spectrum-global-color-gray-300);
    transform: translateY(-3px);
  }

  .chat-empty-card-head {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    background-color: black;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .chat-empty-card-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
  }

  .chat-empty-card-subtitle {
    padding: var(--spacing-m);
  }
</style>
