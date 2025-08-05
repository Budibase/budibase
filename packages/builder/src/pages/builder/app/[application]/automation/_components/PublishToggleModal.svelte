<script lang="ts">
  import { automationStore, deploymentStore } from "@/stores/builder"
  import { Modal, ModalContent } from "@budibase/bbui"
  import type { Automation } from "@budibase/types"

  export let automation: Automation

  let modal: Modal

  export function show() {
    modal.show()
  }

  async function confirm() {
    await automationStore.actions.toggleDisabled(automation._id!)
    await deploymentStore.publishApp()
  }

  let action = automation.disabled ? "activate" : "pause"
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
    To {action} this automation you need to publish all the workspace. <br />Do
    you want to continue?
  </ModalContent>
</Modal>
