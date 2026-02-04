<script>
  import ExportButton from "../ExportButton.svelte"
  import { getContext } from "svelte"

  const { rows, columns, datasource, sort, selectedRows, filter } =
    getContext("grid")

  $: disabled = !$rows.length || !$columns.length
  $: selectedRowArray = Object.keys($selectedRows).map(id => ({ _id: id }))
  $: primarySort = $sort[0]
</script>

<ExportButton
  {disabled}
  view={$datasource.tableId}
  filters={$filter}
  sorting={{
    sortColumn: primarySort?.column,
    sortOrder: primarySort?.order,
  }}
  selectedRows={selectedRowArray}
/>
