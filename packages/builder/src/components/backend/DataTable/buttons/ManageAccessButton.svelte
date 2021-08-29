<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import { permissions } from "stores/backend"
  import ManageAccessModal from "../modals/ManageAccessModal.svelte"
  import { _ as t } from "svelte-i18n"

  export let resourceId

  let modal
  let resourcePermissions

  async function openDropdown() {
    resourcePermissions = await permissions.forResource(resourceId)
    modal.show()
  }
</script>

<ActionButton icon="LockClosed" size="S" quiet on:click={openDropdown}>
  {$t("manage-access-0")}
</ActionButton>
<Modal bind:this={modal}>
  <ManageAccessModal
    {resourceId}
    levels={$permissions}
    permissions={resourcePermissions}
  />
</Modal>
