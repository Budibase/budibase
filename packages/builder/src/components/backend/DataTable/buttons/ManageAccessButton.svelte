<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import { permissions } from "stores/backend"
  import ManageAccessModal from "../modals/ManageAccessModal.svelte"
  import { _ } from "../../../../../lang/i18n"

  export let resourceId

  let modal
  let resourcePermissions

  async function openDropdown() {
    resourcePermissions = await permissions.forResource(resourceId)
    modal.show()
  }
</script>

<ActionButton icon="LockClosed" size="S" quiet on:click={openDropdown}>
  {$_("components.backend.DataTable.buttons.ManageAccessButton.Manage_access")}
</ActionButton>
<Modal bind:this={modal}>
  <ManageAccessModal
    {resourceId}
    levels={$permissions}
    permissions={resourcePermissions}
  />
</Modal>
