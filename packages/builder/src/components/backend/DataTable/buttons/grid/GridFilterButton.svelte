<script>
  import TableFilterButton from "../TableFilterButton.svelte"
  import { getContext } from "svelte"

  const { columns, datasource, filter, definition } = getContext("grid")

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
