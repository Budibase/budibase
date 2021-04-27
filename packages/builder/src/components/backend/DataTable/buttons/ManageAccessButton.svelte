<script>
  import { Button, Modal } from "@budibase/bbui"
  import { permissions } from "stores/backend"
  import ManageAccessModal from "../modals/ManageAccessModal.svelte"

  export let resourceId

  let modal
  let resourcePermissions

  async function openDropdown() {
    resourcePermissions = await permissions.forResource(resourceId)
    modal.show()
  }
</script>

<Button icon="LockClosed" primary size="S" quiet on:click={openDropdown}>
  Manage Access
</Button>
<Modal bind:this={modal}>
  <ManageAccessModal
    {resourceId}
    levels={$permissions}
    permissions={resourcePermissions} />
</Modal>
