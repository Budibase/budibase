<script>
  import { Select, Label } from "@budibase/bbui"
  import { tables, datasources, viewsV2 } from "@/stores/builder"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  export let parameters
  export let bindings = []

  $: datasourceMap = Object.fromEntries(
    ($datasources.list || []).map(ds => [ds._id, ds.name])
  )
  $: tableOptions = $tables.list.map(table => {
    const datasourceName = datasourceMap[table.sourceId] || "Unknown"
    return {
      label: `${datasourceName} - ${table.name}`,
      resourceId: table._id,
    }
  })
  $: viewOptions = $viewsV2.list.map(view => {
    const table = $tables.list.find(t => t._id === view.tableId)
    const datasourceName = datasourceMap[table.sourceId] || "Unknown"
    return {
      label: `${datasourceName} - ${view.name}`,
      resourceId: view.id,
    }
  })
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
    title="Row ID"
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
