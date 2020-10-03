<script>
  import { TextButton, Icon, Popover } from "@budibase/bbui"
  import api from "builderStore/api"
  import ExportPopover from "../popovers/ExportPopover.svelte"

  export let view

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <TextButton text small on:click={dropdown.show}>
    <Icon name="download" />
    Export
  </TextButton>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <ExportPopover {view} onClosed={dropdown.hide} />
</Popover>
