<script>
  import { DropdownMenu, TextButton as Button, Icon } from "@budibase/bbui"
  import CreateEditRecord from "./CreateEditRecord.svelte"

  let anchor
  let dropdown
</script>

<div bind:this={anchor}>
  <Button text small on:click={dropdown.show}>
    <Icon name="addrow" />
    Create New Row
  </Button>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <h5>Add New Row</h5>
  <CreateEditRecord onClosed={dropdown.hide} />
</DropdownMenu>

<style>
  h5 {
    padding: var(--spacing-xl) 0 0 var(--spacing-xl);
    margin: 0;
    font-weight: 500;
  }
</style>
