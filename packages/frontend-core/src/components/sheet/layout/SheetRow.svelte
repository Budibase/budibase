<script>
  import { getContext } from "svelte"
  import DataCell from "../cells/DataCell.svelte"

  export let row
  export let idx
  export let invertY = false

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
    columnHorizontalInversionIndex,
  } = getContext("sheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
  $: rowFocused = $focusedRow?._id === row._id
  $: reorderSource = $reorder.sourceColumn
  $: cols = rowFocused ? $visibleColumns : $renderedColumns
  $: foo = `margin-left: ${-1 * $hiddenColumnsWidth}px;`
</script>

<div
  class="row"
  on:focus
  on:mouseenter={() => ($hoveredRowId = row._id)}
  on:mouseleave={() => ($hoveredRowId = null)}
>
  {#each $renderedColumns as column, idx (column.name)}
    {@const cellId = `${row._id}-${column.name}`}
    <DataCell
      {cellId}
      {column}
      {row}
      {invertY}
      invertX={idx >= $columnHorizontalInversionIndex}
      {rowFocused}
      highlighted={rowHovered || rowFocused || reorderSource === column.name}
      selected={rowSelected}
      rowIdx={idx}
      focused={$focusedCellId === cellId}
      selectedUser={$selectedCellMap[cellId]}
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
