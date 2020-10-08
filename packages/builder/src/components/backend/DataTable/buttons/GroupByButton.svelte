<script>
  import { Popover, TextButton, Icon } from "@budibase/bbui"
  import GroupByPopover from "../popovers/GroupByPopover.svelte"

  export let view = {}

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <TextButton text small active={!!view.groupBy} on:click={dropdown.show}>
    <Icon name="group" />
    Group By
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <GroupByPopover {view} onClosed={dropdown.hide} />
</Popover>
