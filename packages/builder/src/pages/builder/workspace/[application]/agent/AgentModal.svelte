<script lang="ts">
  import { agentsStore, aiConfigsStore, vectorDbStore } from "@/stores/portal"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"
  import { onMount } from "svelte"
  import { AIConfigType } from "@budibase/types"

  $: goto = $gotoStore

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
    const completionConfigs = ($aiConfigsStore.customConfigs || []).filter(
      config => config.configType !== AIConfigType.EMBEDDINGS
    )

    const aiConfig =
      completionConfigs.find(c => c.isDefault)?._id || completionConfigs[0]?._id
    if (!aiConfig) {
      notifications.error("No chat model configuration found")
      return
    }

    const newAgent = await agentsStore.createAgent({
      name: draft.name,
      aiconfig: aiConfig,
      live: false,
    })
    modal.hide()
    goto(`./${newAgent._id}/config`)
  }

  onMount(() => {
    aiConfigsStore.fetch()
    vectorDbStore.fetch()
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
