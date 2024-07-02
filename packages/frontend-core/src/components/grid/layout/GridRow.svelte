<script>
  import { getContext } from "svelte"
  import DataCell from "../cells/DataCell.svelte"
  import { getCellID } from "../lib/utils"

  export let row
  export let top = false

  const {
    focusedCellId,
    reorder,
    selectedRows,
    scrollableColumns,
    hoveredRowId,
    focusedRow,
    contentLines,
    isDragging,
    dispatch,
    rows,
    columnRenderMap,
    userCellMap,
    isSelectingCells,
    selectedCellMap,
    selectedCellCount,
  } = getContext("grid")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered =
    $hoveredRowId === row._id && (!$selectedCellCount || !$isSelectingCells)
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
  {#each $scrollableColumns as column}
    {@const cellId = getCellID(row._id, column.name)}
    <DataCell
      {cellId}
      {column}
      {row}
      {rowFocused}
      {rowSelected}
      cellSelected={$selectedCellMap[cellId]}
      highlighted={rowHovered || rowFocused || reorderSource === column.name}
      rowIdx={row.__idx}
      topRow={top}
      focused={$focusedCellId === cellId}
      selectedUser={$userCellMap[cellId]}
      width={column.width}
      contentLines={$contentLines}
      hidden={!$columnRenderMap[column.name]}
      isSelectingCells={$isSelectingCells}
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
