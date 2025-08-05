<script lang="ts">
  import { deploymentStore, workspaceAppStore } from "@/stores/builder"
  import { Modal, ModalContent } from "@budibase/bbui"
  import type { WorkspaceApp } from "@budibase/types"

  export let app: WorkspaceApp

  let modal: Modal

  export function show() {
    modal.show()
  }

  async function confirm() {
    await workspaceAppStore.toggleDisabled(app._id!, !app.disabled)
    await deploymentStore.publishApp()
  }
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Publish workspace"
    size="S"
    showCloseIcon={true}
    onConfirm={confirm}
    showCancelButton={true}
    showConfirmButton={true}
    confirmText="Publish workspace"
    cancelText="Cancel"
  >
    To {app.disabled ? "activate" : "pause"} this app you need to publish all the
    workspace. Do you want to continue?
  </ModalContent>
</Modal>
