<script lang="ts">
  import { agentsStore, aiConfigsStore } from "@/stores/portal"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"

  export const show = () => {
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  $: draft = {
    name: "",
  }

  let modal: Modal

  async function createAgent() {
    const aiConfig = $aiConfigsStore.customConfigs.find(c => c.isDefault)?._id
    if (!aiConfig) {
      notifications.error("Default aiconfig not found")
      return
    }
    const newAgent = await agentsStore.createAgent({
      name: draft.name,
      aiconfig: aiConfig,
      live: false,
    })
    modal.hide()
    $goto(`./${newAgent._id}/config`)
  }

  onMount(() => {
    aiConfigsStore.fetch()
  })
</script>

<Modal bind:this={modal}>
  <ModalContent
    title={"New agent"}
    size="M"
    showConfirmButton
    showCancelButton
    showCloseIcon
    onConfirm={createAgent}
  >
    <div class="agent-form">
      <Input label="Name" bind:value={draft.name} placeholder="Support agent" />
    </div>
  </ModalContent>
</Modal>

<style>
  .agent-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
