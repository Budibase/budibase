<script>
  import TableFilterButton from "../TableFilterButton.svelte"
  import { getContext } from "svelte"

  const { columns, config, filter, table, loaded } = getContext("sheet")

  const onFilter = e => {
    filter.set(e.detail || [])
  }
</script>

{#key $config.tableId}
  <TableFilterButton
    schema={$table?.schema}
    filters={$filter}
    on:change={onFilter}
    disabled={!$loaded || !$columns.length}
    tableId={$config.tableId}
  />
{/key}
