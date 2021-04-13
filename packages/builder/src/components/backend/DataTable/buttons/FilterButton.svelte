<script>
  import { Popover, Button, Icon } from "@budibase/bbui"
  import FilterPopover from "../popovers/FilterPopover.svelte"

  export let view = {}

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <Button icon="Filter" primary size="S" quiet
    on:click={dropdown.show}
    active={view.filters && view.filters.length}>
    Filter
  </Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <FilterPopover {view} onClosed={dropdown.hide} />
</Popover>
