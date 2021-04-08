<script>
  import { Popover, TextButton, Icon } from "@budibase/bbui"
  import GroupByPopover from "../popovers/GroupByPopover.svelte"

  export let view = {}

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <TextButton icon="Group" type="overBackground" size="S" quiet active={!!view.groupBy} on:click={dropdown.show}>
    Group By
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <GroupByPopover {view} onClosed={dropdown.hide} />
</Popover>
