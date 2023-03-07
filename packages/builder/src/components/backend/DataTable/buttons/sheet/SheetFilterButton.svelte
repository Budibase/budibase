<script>
  import TableFilterButton from "../TableFilterButton.svelte"
  import { getContext } from "svelte"

  const { columns, config, filter, schema } = getContext("sheet")

  const onFilter = e => {
    filter.set(e.detail || [])
  }
</script>

{#key $config.tableId}
  <TableFilterButton
    schema={$schema}
    filters={$filter}
    on:change={onFilter}
    disabled={!$columns.length}
    tableId={$config.tableId}
  />
{/key}
