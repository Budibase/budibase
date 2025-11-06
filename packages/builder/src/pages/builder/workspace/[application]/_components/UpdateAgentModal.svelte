<script lang="ts">
  import { agentsStore } from "@/stores/portal"
  import { notifications, Input, ModalContent, Modal } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"

  export let agent: Agent

  let name: string = ""
  let error = ""
  let modal: Modal

  export const show = () => {
    name = agent?.name || ""
    error = ""
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  async function saveAgent() {
    if (!agent) {
      return
    }
    try {
      await agentsStore.updateAgent({
        ...agent,
        name,
      })
      notifications.success(`Agent ${name} updated successfully`)
    } catch (error) {
      notifications.error("Error saving agent")
    }
  }

  function checkValid(evt: Event) {
    const target = evt.target as HTMLInputElement
    name = target.value
    if (!name) {
      error = "Name is required"
      return
    }
    error = ""
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Edit Agent"
    confirmText="Save"
    size="L"
    onConfirm={saveAgent}
    disabled={!!error}
  >
    <Input bind:value={name} label="Name" on:input={checkValid} {error} />
  </ModalContent>
</Modal>
