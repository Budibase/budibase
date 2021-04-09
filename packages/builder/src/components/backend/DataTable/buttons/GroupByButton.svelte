<script>
  import { Popover, Button } from "@budibase/bbui"
  import GroupByPopover from "../popovers/GroupByPopover.svelte"

  export let view = {}

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <Button icon="Group" primary size="S" quiet active={!!view.groupBy} on:click={dropdown.show}>
    Group By
  </Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <GroupByPopover {view} onClosed={dropdown.hide} />
</Popover>
