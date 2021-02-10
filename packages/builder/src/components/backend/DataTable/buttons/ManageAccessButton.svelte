<script>
  import { TextButton, Icon, Popover } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { Roles } from "constants/backend"
  import api from "builderStore/api"
  import ManageAccessPopover from "../popovers/ManageAccessPopover.svelte"

  export let resourceId

  let anchor
  let dropdown
  let levels
  let permissions

  async function openDropdown() {
    permissions = await backendUiStore.actions.permissions.forResource(
      resourceId
    )
    levels = await backendUiStore.actions.permissions.fetchLevels()
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
    {levels}
    {permissions}
    onClosed={dropdown.hide} />
</Popover>

<style>
  i {
    margin-right: var(--spacing-xs);
    font-size: var(--font-size-s);
  }
</style>
