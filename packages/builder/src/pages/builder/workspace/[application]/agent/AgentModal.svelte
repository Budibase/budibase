<script lang="ts">
  import { appStore } from "@/stores/builder"
  import { agentsStore, aiConfigsStore, vectorDbStore } from "@/stores/portal"
  import { Input, Modal, ModalContent } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"
  import { onMount } from "svelte"

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
    const workspaceId = $appStore.appId
    const newAgent = await agentsStore.createAgent({
      name: draft.name,
      live: false,
    })
    modal.hide()
    goto(`/builder/workspace/${workspaceId}/agent/${newAgent._id}/config`)
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
