<script>
  import { Select, Label } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  $: tableOptions = $tables.list || []
</script>

<div class="root">
  <Label>Table</Label>
  <Select
    bind:value={parameters.tableId}
    options={tableOptions}
    getOptionLabel={table => table.name}
    getOptionValue={table => table._id}
  />

  <Label small>Row ID</Label>
  <DrawerBindableInput
    {bindings}
    title="Row ID to Fetch"
    value={parameters.rowId}
    on:change={value => (parameters.rowId = value.detail)}
  />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
  }
</style>
