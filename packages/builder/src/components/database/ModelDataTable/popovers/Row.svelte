<script>
  import { DropdownMenu, Button, Icon } from "@budibase/bbui"
  import CreateEditRecord from "../modals/CreateEditRecord.svelte"

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <Button text small on:click={dropdown.show}>
    <Icon name="addrow" />
    Create New Row
  </Button>
</div>
<DropdownMenu bind:this={dropdown} anchor={anchor} align="left">
  <h4>Add New Row</h4>
  <CreateEditRecord onClosed={dropdown.hide} />
</DropdownMenu>

<style>
  h4 {
    padding: var(--spacing-l);
    margin: 0;
  }
</style>
