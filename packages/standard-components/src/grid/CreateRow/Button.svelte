<script>
  import { createEventDispatcher } from "svelte"
  import { DropdownMenu, TextButton as Button, Icon } from "@budibase/bbui"
  import Modal from "./Modal.svelte"

  const dispatch = createEventDispatcher()

  let anchor
  let dropdown

  export let _bb, table
</script>

<div bind:this={anchor}>
  <Button text small on:click={dropdown.show}>
    <Icon name="addrow" />
    Create New Row
  </Button>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <h5>Add New Row</h5>
  <Modal
    {_bb}
    {table}
    onClosed={dropdown.hide}
    on:newRow={() => dispatch('newRow')} />
</DropdownMenu>

<style>
  div {
    display: grid;
  }
  h5 {
    padding: var(--spacing-xl) 0 0 var(--spacing-xl);
    margin: 0;
    font-weight: 500;
  }
</style>
