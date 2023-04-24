<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import { permissions } from "stores/backend"
  import ManageAccessModal from "../modals/ManageAccessModal.svelte"

  export let resourceId
  export let disabled = false

  let modal
  let resourcePermissions

  async function openDropdown() {
    resourcePermissions = await permissions.forResource(resourceId)
    modal.show()
  }
</script>

<ActionButton icon="LockClosed" quiet on:click={openDropdown} {disabled}>
  Access
</ActionButton>
<Modal bind:this={modal}>
  <ManageAccessModal
    {resourceId}
    levels={$permissions}
    permissions={resourcePermissions}
  />
</Modal>
