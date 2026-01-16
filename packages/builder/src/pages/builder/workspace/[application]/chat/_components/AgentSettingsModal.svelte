<script lang="ts">
  import { Button, Modal, ModalContent } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"

  type AgentListItem = Agent & {
    agentId: string
    default?: boolean
  }

  export let open = false
  export let selectedAgent: AgentListItem | undefined
  export let defaultAgentId: string | undefined
  export let isAgentAvailable: (_agentId: string) => boolean
  export let onSetDefault: (_agentId: string) => void
  export let onClose: () => void

  let modal: Modal | undefined

  $: if (modal) {
    if (open) {
      modal.show()
    } else {
      modal.hide()
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

  const handleSetDefault = () => {
    if (selectedAgent) {
      onSetDefault(selectedAgent.agentId)
    }
  }
</script>

<Modal bind:this={modal} on:hide={() => (open ? onClose() : undefined)}>
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
  </ModalContent>
</Modal>

<style>
  .agent-settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .agent-settings-helper {
    margin: 0;
    font-size: 12px;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
