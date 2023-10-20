<script>
  import ExportButton from "../ExportButton.svelte"
  import { getContext } from "svelte"

  const { rows, columns, datasource, sort, selectedRows, filter } =
    getContext("grid")

  $: disabled = !$rows.length || !$columns.length
  $: selectedRowArray = Object.keys($selectedRows).map(id => ({ _id: id }))
</script>

<span data-ignore-click-outside="true">
  <ExportButton
    {disabled}
    view={$datasource.tableId}
    filters={$filter}
    sorting={{
      sortColumn: $sort.column,
      sortOrder: $sort.order,
    }}
    selectedRows={selectedRowArray}
  />
</span>

<style>
  span {
    display: contents;
  }
</style>
