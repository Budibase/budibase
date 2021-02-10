<script>
  import { TextButton, Icon, Popover } from "@budibase/bbui"
  import api from "builderStore/api"
  import ManageAccessPopover from "../popovers/ManageAccessPopover.svelte"

  export let resourceId

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <TextButton text small on:click={dropdown.show}>
    <i class="ri-lock-line" />
    Manage Access
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <ManageAccessPopover {resourceId} onClosed={dropdown.hide} />
</Popover>

<style>
  i {
    margin-right: var(--spacing-xs);
    font-size: var(--font-size-s);
  }
</style>
