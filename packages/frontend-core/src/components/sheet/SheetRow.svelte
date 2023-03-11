<script>
  import { getContext } from "svelte"
  import SheetCell from "./cells/SheetCell.svelte"
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
  on:mouseover={() => ($hoveredRowId = row._id)}
  on:mouseleave={() => ($hoveredRowId = null)}
>
  {#each $renderedColumns as column (column.name)}
    {@const cellId = `${row._id}-${column.name}`}
    <SheetCell
      rowSelected={rowSelected || containsSelectedCell}
      {rowHovered}
      rowIdx={idx}
      selected={$selectedCellId === cellId}
      selectedUser={$selectedCellMap[cellId]}
      reorderSource={$reorder.sourceColumn === column.name}
      reorderTarget={$reorder.targetColumn === column.name}
      on:click={() => ($selectedCellId = cellId)}
      on:contextmenu={e => menu.actions.open(cellId, e)}
      width={column.width}
    >
      <svelte:component
        this={getCellRenderer(column)}
        value={row[column.name]}
        schema={column.schema}
        selected={$selectedCellId === cellId}
        onChange={val => rows.actions.updateRow(row._id, column.name, val)}
        readonly={column.schema.autocolumn}
      />
    </SheetCell>
  {/each}
</div>

<style>
  .row {
    width: 0;
    display: flex;
  }
</style>
