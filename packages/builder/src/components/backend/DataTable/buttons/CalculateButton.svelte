<script>
  import { Popover, Button } from "@budibase/bbui"
  import CalculatePopover from "../popovers/CalculatePopover.svelte"

  export let view = {}

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <Button icon="Calculator" primary size="S" quiet
    on:click={dropdown.show}
    active={view.field && view.calculation}>
    Calculate
  </Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <CalculatePopover {view} onClosed={dropdown.hide} />
</Popover>
