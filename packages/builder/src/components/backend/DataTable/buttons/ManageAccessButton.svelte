<script>
  import { Button, Popover } from "@budibase/bbui"
  import { permissions } from "stores/backend"
  import ManageAccessPopover from "../popovers/ManageAccessPopover.svelte"

  export let resourceId

  let anchor
  let dropdown
  let resourcePermissions

  async function openDropdown() {
    resourcePermissions = await permissions.forResource(resourceId)
    dropdown.show()
  }
</script>

<div bind:this={anchor}>
  <Button icon="LockClosed" type="overBackground" size="S" quiet on:click={openDropdown}>
    Manage Access
  </Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <ManageAccessPopover
    {resourceId}
    levels={$permissions}
    permissions={resourcePermissions}
    onClosed={dropdown.hide} />
</Popover>