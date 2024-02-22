<script>
  import { getContext } from "svelte"
  import DataCell from "../cells/DataCell.svelte"

  export let row
  export let top = false
  export let invertY = false

  const {
    focusedCellId,
    reorder,
    selectedRows,
    visibleColumns,
    hoveredRowId,
    selectedCellMap,
    focusedRow,
    columnHorizontalInversionIndex,
    contentLines,
    isDragging,
    dispatch,
    rows,
    columnRenderMap,
  } = getContext("grid")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
  $: rowFocused = $focusedRow?._id === row._id
  $: reorderSource = $reorder.sourceColumn
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="row"
  on:focus
  on:mouseenter={$isDragging ? null : () => ($hoveredRowId = row._id)}
  on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
  on:click={() => dispatch("rowclick", rows.actions.cleanRow(row))}
>
  {#each $visibleColumns as column, columnIdx}
    {@const cellId = `${row._id}-${column.name}`}
    <DataCell
      {cellId}
      {column}
      {row}
      {invertY}
      {rowFocused}
      invertX={columnIdx >= $columnHorizontalInversionIndex}
      highlighted={rowHovered || rowFocused || reorderSource === column.name}
      selected={rowSelected}
      rowIdx={row.__idx}
      topRow={top}
      focused={$focusedCellId === cellId}
      selectedUser={$selectedCellMap[cellId]}
      width={column.width}
      contentLines={$contentLines}
      hidden={!$columnRenderMap[column.name]}
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
