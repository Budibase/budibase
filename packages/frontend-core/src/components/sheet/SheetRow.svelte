<script>
  import { getContext } from "svelte"
  import SheetCell from "./cells/SheetCell.svelte"
  import DataCell from "./cells/DataCell.svelte"
  import { getCellRenderer } from "./renderers"

  export let row
  export let idx

  const {
    selectedCellId,
    reorder,
    selectedRows,
    rows,
    renderedColumns,
    hoveredRowId,
    selectedCellMap,
    selectedCellRow,
    menu,
  } = getContext("sheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
  $: containsSelectedCell = $selectedCellRow?._id === row._id
</script>

<div
  class="row"
  on:focus
  on:mouseenter={() => ($hoveredRowId = row._id)}
  on:mouseleave={() => ($hoveredRowId = null)}
>
  {#each $renderedColumns as column (column.name)}
    {@const cellId = `${row._id}-${column.name}`}
    <DataCell
      rowSelected={rowSelected || containsSelectedCell}
      {rowHovered}
      rowIdx={idx}
      selected={$selectedCellId === cellId}
      selectedUser={$selectedCellMap[cellId]}
      reorderSource={$reorder.sourceColumn === column.name}
      reorderTarget={$reorder.targetColumn === column.name}
      width={column.width}
      {cellId}
      {column}
      {row}
    />
  {/each}
</div>

<style>
  .row {
    width: 0;
    display: flex;
  }
</style>
