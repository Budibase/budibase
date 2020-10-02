<script>
  import { Popover, TextButton, Icon } from "@budibase/bbui"
  import FilterPopover from "../popovers/FilterPopover.svelte"

  export let view = {}

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <TextButton
    text
    small
    on:click={dropdown.show}
    active={view.filters && view.filters.length}>
    <Icon name="filter" />
    Filter
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <FilterPopover {view} onClosed={dropdown.hide} />
</Popover>
