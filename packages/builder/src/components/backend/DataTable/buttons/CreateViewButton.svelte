<script>
  import { Popover, Button } from "@budibase/bbui"
  import CreateViewPopover from "../popovers/CreateViewPopover.svelte"

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <Button icon="CollectionAdd" primary size="S" quiet on:click={dropdown.show}>
    Create New View
  </Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <CreateViewPopover onClosed={dropdown.hide} />
</Popover>
