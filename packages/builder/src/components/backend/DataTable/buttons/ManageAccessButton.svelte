<script>
  import { ActionButton } from "@budibase/bbui"
  import { permissions } from "stores/builder"
  import ManageAccessModal from "../modals/ManageAccessModal.svelte"
  import DetailPopover from "components/common/DetailPopover.svelte"
  import EditRolesButton from "./EditRolesButton.svelte"

  export let resourceId

  let resourcePermissions
  let showPopover = true

  $: fetchPermissions(resourceId)

  const fetchPermissions = async id => {
    resourcePermissions = await permissions.forResourceDetailed(id)
  }
</script>

<DetailPopover title="Manage access" {showPopover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton icon="LockClosed" selected={open} quiet>Access</ActionButton>
  </svelte:fragment>
  {#if resourcePermissions}
    <ManageAccessModal {resourceId} permissions={resourcePermissions} />
  {/if}
  <EditRolesButton
    on:show={() => (showPopover = false)}
    on:hide={() => (showPopover = true)}
  />
</DetailPopover>
