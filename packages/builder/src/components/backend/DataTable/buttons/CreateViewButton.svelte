<script>
  import { Popover, TextButton, Icon } from "@budibase/bbui"
  import CreateViewPopover from "../popovers/CreateViewPopover.svelte"

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <TextButton text small on:click={dropdown.show}>
    <Icon name="view" />
    Create New View
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <CreateViewPopover onClosed={dropdown.hide} />
</Popover>
