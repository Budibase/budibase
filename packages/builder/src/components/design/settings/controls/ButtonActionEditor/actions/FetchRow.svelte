<script>
  import { Select, Label } from "@budibase/bbui"
  import { tables, viewsV2 } from "stores/backend"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  $: tableOptions = $tables.list.map(table => ({
    label: table.name,
    resourceId: table._id,
  }))
  $: viewOptions = $viewsV2.list.map(view => ({
    label: view.name,
    resourceId: view.id,
  }))
  $: options = [...(tableOptions || []), ...(viewOptions || [])]
</script>

<div class="root">
  <Label>Table</Label>
  <Select
    bind:value={parameters.tableId}
    {options}
    getOptionLabel={table => table.label}
    getOptionValue={table => table.resourceId}
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
