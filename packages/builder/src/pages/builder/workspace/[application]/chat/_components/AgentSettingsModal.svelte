<script lang="ts">
  import {
    Body,
    Button,
    Helpers,
    Icon,
    Input,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { Utils } from "@budibase/frontend-core"
  import type { ChatAppAgent, ConversationStarter } from "@budibase/types"
  import type { AgentListItem } from "./types"

  type ConversationStarterItem = ConversationStarter & {
    id: string
  }

  export let open = false
  export let selectedAgent: AgentListItem | undefined
  export let selectedAgentConfig: ChatAppAgent | undefined
  export let defaultAgentId: string | undefined
  export let isAgentAvailable: (_agentId: string) => boolean
  export let onSetDefault: (_agentId: string) => void
  export let onUpdateConversationStarters: (
    _agentId: string,
    _starters: ConversationStarter[]
  ) => void
  export let onClose: () => void

  let modal: Modal | undefined
  let conversationStarters: ConversationStarterItem[] = []
  let newStarter = ""
  let lastAgentId: string | undefined

  $: if (modal) {
    if (open) {
      modal.show()
    } else {
      modal.hide()
    }
  }

  $: if (selectedAgentConfig?.agentId !== lastAgentId) {
    lastAgentId = selectedAgentConfig?.agentId
    conversationStarters = (
      selectedAgentConfig?.conversationStarters || []
    ).map(starter => ({
      id: Helpers.uuid(),
      prompt: starter.prompt,
    }))
    newStarter = ""
  }

  $: isDefault = selectedAgent?.agentId === defaultAgentId
  $: isAvailable = selectedAgent && isAgentAvailable(selectedAgent.agentId)
  $: disabledReason = isDefault
    ? "This agent is already the default."
    : !isAvailable
      ? "Enable this agent to set it as default."
      : ""
  $: isDisabled = !selectedAgent || !isAvailable || isDefault

  const saveConversationStarters = () => {
    if (!selectedAgentConfig?.agentId) {
      return
    }

    const trimmedStarters = conversationStarters
      .map(starter => ({ prompt: starter.prompt.trim() }))
      .filter(starter => starter.prompt.length)
      .slice(0, 3)

    onUpdateConversationStarters(selectedAgentConfig.agentId, trimmedStarters)
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
      idx === index ? { ...starter, prompt: value } : starter
    )
  }

  const removeStarter = (index: number) => {
    conversationStarters = conversationStarters.filter(
      (_, idx) => idx !== index
    )
    newStarter = ""
    debouncedSave()
  }

  const addStarter = () => {
    const trimmed = newStarter.trim()
    if (!trimmed || conversationStarters.length >= 3) {
      newStarter = ""
      return
    }

    conversationStarters = [
      ...conversationStarters,
      { id: Helpers.uuid(), prompt: trimmed },
    ]
    newStarter = ""
    debouncedSave()
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
        {#each conversationStarters as starter, index (starter.id)}
          <div class="starter-row">
            <div class="starter-input">
              <Input
                value={starter.prompt}
                on:change={event => updateStarter(index, event.detail)}
                on:blur={debouncedSave}
              />
            </div>
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
          <div class="starter-input starter-input--new">
            <Input
              placeholder="Example for users to start a conversation"
              value={newStarter}
              on:change={event => (newStarter = event.detail)}
              on:blur={addStarter}
              on:enterkey={addStarter}
            />
          </div>
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
  }

  .starter-input :global(.spectrum-Textfield) {
    width: 100%;
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
