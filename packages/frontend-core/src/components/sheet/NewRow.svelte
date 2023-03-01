<script>
  import SheetCell from "./SheetCell.svelte"
  import { Icon } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { visibleColumns, cellHeight, rows, selectedCellId, reorder } =
    getContext("spreadsheet")

  const addRow = async field => {
    const newRow = await rows.actions.addRow()
    if (newRow) {
      $selectedCellId = `${newRow._id}-${field.name}`
    }
  }
</script>

<div class="row new">
  {#each $visibleColumns as column}
    <SheetCell
      on:click={() => addRow(column)}
      width={column.width}
      left={column.left}
      reorderSource={$reorder.columnIdx === column.idx}
      reorderTarget={$reorder.swapColumnIdx === column.idx}
    />
  {/each}
</div>

<style>
  .row {
    display: flex;
    width: inherit;
    height: var(--cell-height);
  }
  :global(.sheet:not(.is-resizing):not(.is-reordering) .row:hover .cell) {
    background: var(--cell-background-hover);
    cursor: pointer;
  }
</style>
