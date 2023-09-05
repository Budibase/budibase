<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import { permissions } from "stores/backend"
  import ManageAccessModal from "../modals/ManageAccessModal.svelte"

  export let resourceId
  export let disabled = false

  let modal
  let resourcePermissions

  async function openModal() {
    resourcePermissions = await permissions.forResourceDetailed(resourceId)
    modal.show()
  }
</script>

<ActionButton icon="LockClosed" quiet on:click={openModal} {disabled}>
  Access
</ActionButton>
<Modal bind:this={modal}>
  <ManageAccessModal {resourceId} permissions={resourcePermissions} />
</Modal>
