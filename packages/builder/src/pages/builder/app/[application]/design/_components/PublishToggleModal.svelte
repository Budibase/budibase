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

  let action = app.disabled ? "activate" : "pause"
</script>

<Modal bind:this={modal} on:show on:cancel on:hide>
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
    To {action} this app you need to publish all the workspace. Do you want to continue?
  </ModalContent>
</Modal>
