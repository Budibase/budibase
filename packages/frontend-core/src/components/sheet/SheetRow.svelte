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
    cellHeight,
  } = getContext("spreadsheet")

  console.log("mount")

  $: rowSelected = !!$selectedRows[row._id]
</script>

<div class="row">
  {#each $visibleColumns as column (column.name)}
    {@const cellIdx = `${row._id}-${column.name}`}
    <SheetCell
      {rowSelected}
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
  :global(.sheet:not(.is-resizing):not(.is-reordering) .row:hover .cell) {
    background: var(--cell-background-hover);
  }
</style>
