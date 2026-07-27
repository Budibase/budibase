<script lang="ts">
  import ExportButton from "../ExportButton.svelte"
  import { getContext } from "svelte"
  import type { Readable } from "svelte/store"
  import type {
    SortOrder,
    UIColumn,
    UIDatasource,
    UIRow,
  } from "@budibase/types"

  interface SortEntry {
    column: string
    order: SortOrder
  }

  interface GridContext {
    rows: Readable<UIRow[]>
    columns: Readable<UIColumn[]>
    datasource: Readable<UIDatasource>
    sort: Readable<SortEntry[]>
    selectedRows: Readable<Record<string, boolean>>
  }

  const { rows, columns, datasource, sort, selectedRows } =
    getContext<GridContext>("grid")

  $: disabled = !$rows.length || !$columns.length
  $: selectedRowArray = Object.keys($selectedRows).map(id => ({ _id: id }))
</script>

<ExportButton
  {disabled}
  view={$datasource.tableId}
  sorting={$sort}
  selectedRows={selectedRowArray}
/>
