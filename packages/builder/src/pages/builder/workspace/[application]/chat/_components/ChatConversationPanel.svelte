<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { Body, Button, Icon, ProgressCircle } from "@budibase/bbui"
  import { Chatbox } from "@budibase/frontend-core/src/components"
  import { helpers } from "@budibase/shared-core"
  import type { ChatConversation, DraftChatConversation } from "@budibase/types"
  import { auth } from "@/stores/portal"

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
  export let initialPrompt: string = ""

  const dispatch = createEventDispatcher<{
    chatSaved: { chatId?: string; chat: ChatConversationLike }
    deleteChat: undefined
    agentSelected: { agentId: string }
    startChat: { agentId: string; prompt: string }
  }>()

  const hasChatId = (value: ChatConversationLike) =>
    value && "_id" in value && Boolean(value._id)

  const buildGreeting = (name: string) => {
    const currentDate = new Date()
    const suffix = name ? `, ${name}` : ""

    if (currentDate.getDay() === 1) {
      return `Happy Monday${suffix}`
    }

    const isMorning = currentDate.getHours() < 12
    return `${isMorning ? "Good Morning" : "Good Afternoon"}${suffix}`
  }

  let readOnlyReason: "disabled" | "deleted" | "offline" | undefined

  let emptyPrompt = ""

  $: userName = $auth.user ? helpers.getUserLabel($auth.user) : ""
  $: greetingText = buildGreeting(userName)

  $: visibleAgentList = enabledAgentList.slice(0, 3)
  $: hasEnabledAgents = enabledAgentList.length > 0

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

  const startChat = () => {
    const prompt = emptyPrompt.trim()
    if (!prompt) {
      return
    }

    const agentId = enabledAgentList[0]?.agentId
    if (!agentId) {
      return
    }

    dispatch("startChat", { agentId, prompt })
    emptyPrompt = ""
  }

  const handlePromptKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") {
      return
    }

    event.preventDefault()
    startChat()
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
      {initialPrompt}
      readOnly={Boolean(readOnlyReason)}
      {readOnlyReason}
      onchatsaved={event => dispatch("chatSaved", event.detail)}
    />
  {:else}
    <div class="chat-empty">
      <div class="chat-empty-greeting">
        <Body size="XL" weight="600" serif>
          {greetingText}
        </Body>
      </div>
      <div class="chat-empty-input" role="presentation">
        <input
          class="chat-empty-input-field"
          type="text"
          placeholder="How can I help you today?"
          bind:value={emptyPrompt}
          on:keydown={handlePromptKeyDown}
          disabled={!hasEnabledAgents}
        />
        <button
          class="chat-empty-input-action"
          type="button"
          on:click={startChat}
          disabled={!hasEnabledAgents}
          aria-label="Start chat"
        >
          <Icon name="arrow-up" size="S" />
        </button>
      </div>
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
    gap: 32px;
    padding: var(--spacing-xxl);
    text-align: center;
  }

  .chat-empty-greeting :global(p) {
    color: var(--spectrum-global-color-gray-800);
    font-size: 28px;
    line-height: 34px;
  }

  .chat-empty-input {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    width: min(720px, 100%);
    padding: 10px;
    padding-left: 20px;
    border-radius: 999px;
    background: #2b2b2b;
    color: var(--spectrum-global-color-gray-100);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .chat-empty-input-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--spectrum-global-color-gray-100);
  }

  .chat-empty-input-field {
    flex: 1;
    font-size: 16px;
    color: white;
    background: transparent;
    border: none;
    outline: none;
    font: inherit;
  }

  .chat-empty-input-field::placeholder {
    color: var(--spectrum-global-color-gray-300);
  }

  .chat-empty-input-action {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    background: #8cb4f0;
    color: #101828;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
  }

  .chat-empty-input-action:disabled,
  .chat-empty-input-field:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .chat-empty-grid {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: min(720px, 100%);
    align-items: center;
    justify-content: center;
  }

  .chat-empty-card {
    border: 1px solid var(--spectrum-global-color-gray-200);
    width: 240px;
    border-radius: 16px;
    padding: 0;
    background: var(--spectrum-alias-background-color-primary);
    color: var(--spectrum-global-color-gray-800);
    font: inherit;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    transform: translateY(var(--card-offset, 0px))
      rotate(var(--card-rotation, 0deg));
    transition:
      border-color 150ms ease,
      transform 150ms ease;
  }

  .chat-empty-card:hover {
    border-color: var(--spectrum-global-color-gray-300);
    transform: translateY(calc(var(--card-offset, 0px) - 3px))
      rotate(var(--card-rotation, 0deg));
  }

  .chat-empty-card:first-child {
    --card-rotation: -6deg;
    --card-offset: 12px;
  }

  .chat-empty-card:last-child {
    --card-rotation: 6deg;
    --card-offset: 12px;
  }

  .chat-empty-card-head {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-m);
    background-color: #080808;
    color: white;
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
