<script>
  import TableFilterButton from "../TableFilterButton.svelte"
  import { getContext } from "svelte"

  const { columns, tableId, filter, table } = getContext("grid")

  const onFilter = e => {
    filter.set(e.detail || [])
  }
</script>

{#key $tableId}
  <TableFilterButton
    schema={$table?.schema}
    filters={$filter}
    on:change={onFilter}
    disabled={!$columns.length}
    tableId={$tableId}
  />
{/key}
