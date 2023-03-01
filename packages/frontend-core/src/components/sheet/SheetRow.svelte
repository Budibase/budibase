<svelte:options immutable={true} />

<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { getCellComponent } from "./utils"

  export let row

  const {
    selectedCellId,
    reorder,
    selectedRows,
    rows,
    visibleColumns,
    hoveredRowId,
  } = getContext("spreadsheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
</script>

<div class="row" on:mouseover={() => ($hoveredRowId = row._id)}>
  {#each $visibleColumns as column (column.name)}
    {@const cellIdx = `${row._id}-${column.name}`}
    <SheetCell
      {rowSelected}
      {rowHovered}
      selected={$selectedCellId === cellIdx}
      reorderSource={$reorder.columnIdx === column.idx}
      reorderTarget={$reorder.swapColumnIdx === column.idx}
      on:click={() => ($selectedCellId = cellIdx)}
      width={column.width}
      left={column.left}
    >
      <svelte:component
        this={getCellComponent(column)}
        value={row[column.name]}
        schema={column.schema}
        selected={$selectedCellId === cellIdx}
        onChange={val => rows.actions.updateRow(row._id, column, val)}
        readonly={column.schema.autocolumn}
      />
    </SheetCell>
  {/each}
</div>

<style>
  .row {
    display: flex;
  }
</style>
