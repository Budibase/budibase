<script>
  import { Popover, TextButton, Icon } from "@budibase/bbui"
  import CalculatePopover from "../popovers/CalculatePopover.svelte"

  export let view = {}

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <TextButton
    text
    small
    on:click={dropdown.show}
    active={view.field && view.calculation}>
    <Icon name="calculate" />
    Calculate
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <CalculatePopover {view} onClosed={dropdown.hide} />
</Popover>
