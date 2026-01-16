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
  export let isAgentAvailable: (agentId: string) => boolean
  export let onSetDefault: (agentId: string) => void
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
  $: isDisabled =
    !selectedAgent || !isAgentAvailable(selectedAgent.agentId) || isDefault

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
    </div>
  </ModalContent>
</Modal>

<style>
  .agent-settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
</style>
