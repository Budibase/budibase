<script>
  import TableFilterButton from "../TableFilterButton.svelte"
  import { getContext } from "svelte"

  const { columns, config, filter, table } = getContext("grid")

  const onFilter = e => {
    filter.set(e.detail || [])
  }
</script>

{#key $config.tableId}
  <TableFilterButton
    schema={$table?.schema}
    filters={$filter}
    on:change={onFilter}
    disabled={!$columns.length}
    tableId={$config.tableId}
  />
{/key}
