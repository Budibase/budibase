<script>
  import { getContext } from "svelte"
  import DataCell from "../cells/DataCell.svelte"

  export let row
  export let idx
  export let invert = false

  const {
    focusedCellId,
    reorder,
    selectedRows,
    visibleColumns,
    renderedColumns,
    hoveredRowId,
    selectedCellMap,
    focusedRow,
    hiddenColumnsWidth,
  } = getContext("sheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
  $: rowFocused = $focusedRow?._id === row._id
  $: cols = rowFocused ? $visibleColumns : $renderedColumns
  $: foo = `margin-left: ${-1 * $hiddenColumnsWidth}px;`
</script>

<div
  class="row"
  style={rowFocused ? foo : null}
  on:focus
  on:mouseenter={() => ($hoveredRowId = row._id)}
  on:mouseleave={() => ($hoveredRowId = null)}
>
  {#each cols as column (column.name)}
    {@const cellId = `${row._id}-${column.name}`}
    <DataCell
      {rowSelected}
      {rowHovered}
      {rowFocused}
      {cellId}
      {column}
      {row}
      {invert}
      rowIdx={idx}
      focused={$focusedCellId === cellId}
      selectedUser={$selectedCellMap[cellId]}
      reorderSource={$reorder.sourceColumn === column.name}
      reorderTarget={$reorder.targetColumn === column.name}
      width={column.width}
    />
  {/each}
</div>

<style>
  .row {
    width: 0;
    display: flex;
    height: var(--row-height);
  }
</style>
