<script>
  import { Button, Icon, Popover } from "@budibase/bbui"
  import ExportPopover from "../popovers/ExportPopover.svelte"

  export let view

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <Button icon="Download" type="overBackground" size="S" quiet on:click={dropdown.show}>
    Export
  </Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <ExportPopover {view} onClosed={dropdown.hide} />
</Popover>
