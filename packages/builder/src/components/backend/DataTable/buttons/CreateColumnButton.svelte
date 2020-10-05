<script>
  import { DropdownMenu, TextButton as Button, Icon } from "@budibase/bbui"
  import CreateEditColumnPopover from "../popovers/CreateEditColumnPopover.svelte"

  let anchor
  let dropdown
  let fieldName
</script>

<div bind:this={anchor}>
  <Button text small on:click={dropdown.show}>
    <Icon name="addcolumn" />
    Create New Column
  </Button>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <h5>Create Column</h5>
  <CreateEditColumnPopover onClosed={dropdown.hide} />
</DropdownMenu>

<style>
  h5 {
    padding: var(--spacing-xl) 0 0 var(--spacing-xl);
    margin: 0;
    font-weight: 500;
  }
</style>
