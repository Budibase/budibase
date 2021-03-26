<script>
  import { TextButton, Popover } from "@budibase/bbui"
  import { permissions } from 'stores/backend/'
  import ManageAccessPopover from "../popovers/ManageAccessPopover.svelte"

  export let resourceId

  let anchor
  let dropdown
  let resourcePermissions

  async function openDropdown() {
    resourcePermissions = await permissions.forResource(
      resourceId
    )
    dropdown.show()
  }
</script>

<div bind:this={anchor}>
  <TextButton text small on:click={openDropdown}>
    <i class="ri-lock-line" />
    Manage Access
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <ManageAccessPopover
    {resourceId}
    levels={$permissions}
    permissions={resourcePermissions}
    onClosed={dropdown.hide} />
</Popover>

<style>
  i {
    margin-right: var(--spacing-xs);
    font-size: var(--font-size-s);
  }
</style>
