<script>
  import TableFilterButton from "../TableFilterButton.svelte"
  import { getContext } from "svelte"

  const { columns, datasource, filter, definition } = getContext("grid")

  // Wipe filter whenever table ID changes to avoid using stale filters
  $: $datasource, filter.set([])

  const onFilter = e => {
    filter.set(e.detail || [])
  }
</script>

{#key $datasource}
  <TableFilterButton
    schema={$definition?.schema}
    filters={$filter}
    on:change={onFilter}
    disabled={!$columns.length}
    tableId={$datasource.tableId}
  />
{/key}
