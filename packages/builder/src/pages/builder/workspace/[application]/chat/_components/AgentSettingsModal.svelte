<script lang="ts">
  import { chatAppsStore, currentChatApp } from "@/stores/portal/chatApps"
  import { Body, Button, Icon, Modal, ModalContent } from "@budibase/bbui"
  import { Utils } from "@budibase/frontend-core"
  import type { Agent, ChatApp } from "@budibase/types"

  type AgentListItem = Agent & {
    agentId: string
    default?: boolean
  }

  type ConversationStarter = {
    prompt: string
  }

  type ChatAppWithStarters = ChatApp & {
    conversationStartersByAgent?: Record<string, ConversationStarter[]>
  }

  export let open = false
  export let selectedAgent: AgentListItem | undefined
  export let defaultAgentId: string | undefined
  export let isAgentAvailable: (_agentId: string) => boolean
  export let onSetDefault: (_agentId: string) => void
  export let onClose: () => void
  export let workspaceId: string | undefined

  let modal: Modal | undefined
  let conversationStarters: ConversationStarter[] = []
  let newStarter = ""
  let lastAgentId: string | undefined
  let lastChatAppId: string | undefined
  let ensuringChatApp = false

  $: chatApp = $currentChatApp as ChatAppWithStarters | undefined

  $: if (modal) {
    if (open) {
      modal.show()
    } else {
      modal.hide()
    }
  }

  $: if (open && selectedAgent && workspaceId) {
    ensureChatApp()
  }

  $: if (open && selectedAgent?.agentId && chatApp?._id) {
    if (
      selectedAgent.agentId !== lastAgentId ||
      chatApp._id !== lastChatAppId
    ) {
      lastAgentId = selectedAgent.agentId
      lastChatAppId = chatApp._id
      conversationStarters = getStartersForAgent(selectedAgent.agentId, chatApp)
      newStarter = ""
    }
  }

  $: isDefault = selectedAgent?.agentId === defaultAgentId
  $: isAvailable = selectedAgent && isAgentAvailable(selectedAgent.agentId)
  $: disabledReason = isDefault
    ? "This agent is already the default."
    : !isAvailable
      ? "Enable this agent to set it as default."
      : ""
  $: isDisabled = !selectedAgent || !isAvailable || isDefault

  const ensureChatApp = async () => {
    if (ensuringChatApp) {
      return
    }
    ensuringChatApp = true
    try {
      await chatAppsStore.ensureChatApp(undefined, workspaceId)
    } finally {
      ensuringChatApp = false
    }
  }

  const getStartersForAgent = (agentId: string, app: ChatAppWithStarters) => {
    const starters = app.conversationStartersByAgent?.[agentId] || []
    return starters.map((starter: ConversationStarter) => ({
      prompt: starter.prompt,
    }))
  }

  const saveConversationStarters = async () => {
    if (!selectedAgent?.agentId) {
      return
    }

    const resolvedChatApp = (chatApp ||
      (await chatAppsStore.ensureChatApp(
        undefined,
        workspaceId
      ))) as ChatAppWithStarters | null

    if (!resolvedChatApp?._id) {
      return
    }

    const trimmedStarters = conversationStarters
      .map((starter: ConversationStarter) => ({
        prompt: starter.prompt.trim(),
      }))
      .filter(starter => starter.prompt.length)
      .slice(0, 3)

    const nextStarters = {
      ...(resolvedChatApp.conversationStartersByAgent || {}),
      [selectedAgent.agentId]: trimmedStarters,
    }

    await chatAppsStore.updateChatApp({
      conversationStartersByAgent: nextStarters,
    })
  }

  const debouncedSave = Utils.debounce(() => {
    saveConversationStarters()
  }, 400)

  const handleSetDefault = () => {
    if (selectedAgent) {
      onSetDefault(selectedAgent.agentId)
    }
  }

  const updateStarter = (index: number, value: string) => {
    conversationStarters = conversationStarters.map((starter, idx) =>
      idx === index ? { prompt: value } : starter
    )
  }

  const removeStarter = (index: number) => {
    conversationStarters = conversationStarters.filter(
      (_, idx) => idx !== index
    )
    debouncedSave()
  }

  const addStarter = () => {
    const trimmed = newStarter.trim()
    if (!trimmed || conversationStarters.length >= 3) {
      newStarter = ""
      return
    }

    conversationStarters = [...conversationStarters, { prompt: trimmed }]
    newStarter = ""
    debouncedSave()
  }

  const handleNewStarterKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") {
      return
    }
    event.preventDefault()
    addStarter()
  }
</script>

<Modal
  bind:this={modal}
  autoFocus={false}
  on:hide={() => (open ? onClose() : undefined)}
>
  <ModalContent
    size="M"
    title={`${selectedAgent?.name || "Agent"} settings`}
    showConfirmButton={false}
  >
    <div class="agent-settings">
      <Button size="S" disabled={isDisabled} on:click={handleSetDefault}>
        Set as default
      </Button>
      {#if disabledReason}
        <p class="agent-settings-helper">{disabledReason}</p>
      {/if}
    </div>

    <div class="agent-settings-section">
      <Body size="XS" color="var(--spectrum-global-color-gray-600)">
        Conversation starters
      </Body>
      <div class="starter-list">
        {#each conversationStarters as starter, index (index)}
          <div class="starter-row">
            <input
              class="starter-input"
              type="text"
              value={starter.prompt}
              on:input={event =>
                updateStarter(index, (event.target as HTMLInputElement).value)}
              on:blur={() => debouncedSave()}
            />
            <button
              class="starter-remove"
              type="button"
              on:click={() => removeStarter(index)}
              aria-label="Remove conversation starter"
            >
              <Icon name="trash" size="S" />
            </button>
          </div>
        {/each}
        {#if conversationStarters.length < 3}
          <input
            class="starter-input starter-input--new"
            type="text"
            placeholder="Example for users to start a conversation"
            bind:value={newStarter}
            on:blur={addStarter}
            on:keydown={handleNewStarterKeydown}
          />
        {/if}
      </div>
    </div>
  </ModalContent>
</Modal>

<style>
  .agent-settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .agent-settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    margin-top: var(--spacing-l);
  }

  .starter-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .starter-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .starter-input {
    flex: 1 1 auto;
    padding: var(--spacing-s);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 12px;
    background: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-global-color-gray-800);
    font: inherit;
  }

  .starter-input::placeholder {
    color: var(--spectrum-global-color-gray-500);
  }

  .starter-input--new {
    border-style: dashed;
  }

  .starter-remove {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 12px;
    background: var(--spectrum-global-color-gray-50);
    color: var(--spectrum-global-color-gray-600);
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .starter-remove:hover {
    color: var(--spectrum-global-color-gray-800);
    border-color: var(--spectrum-global-color-gray-300);
  }

  .agent-settings-helper {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
