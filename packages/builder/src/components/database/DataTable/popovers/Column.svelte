<script>
  import { backendUiStore } from "builderStore"
  import {
    DropdownMenu,
    TextButton as Button,
    Icon,
    Input,
    Select,
  } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"

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
  <CreateEditColumn onClosed={dropdown.hide} />
</DropdownMenu>

<style>
  h5 {
    padding: var(--spacing-xl) 0 0 var(--spacing-xl);
    margin: 0;
    font-weight: 500;
  }
</style>
