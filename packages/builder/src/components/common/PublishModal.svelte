<script lang="ts">
  import { deploymentStore } from "@/stores/builder"
  import { Modal, ModalContent } from "@budibase/bbui"

  export let onConfirm: () => Promise<any> | any

  let modal: Modal

  export function show() {
    modal.show()
  }

  async function confirm() {
    await onConfirm()
    await deploymentStore.publishApp()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Publish workspace"
    size="M"
    showCloseIcon={true}
    onConfirm={confirm}
    showCancelButton={true}
    showConfirmButton={true}
    confirmText="Publish workspace"
    cancelText="Cancel"
  >
    <slot />
  </ModalContent>
</Modal>
