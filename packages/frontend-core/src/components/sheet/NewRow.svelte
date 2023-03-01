<script>
  import SheetCell from "./SheetCell.svelte"
  import { getContext } from "svelte"

  const { visibleColumns, hoveredRowId, rows, selectedCellId, reorder } =
    getContext("spreadsheet")

  $: rowHovered = $hoveredRowId === "new"

  const addRow = async field => {
    const newRow = await rows.actions.addRow()
    if (newRow) {
      $selectedCellId = `${newRow._id}-${field.name}`
    }
  }
</script>

<div class="row" on:mouseover={() => ($hoveredRowId = "new")}>
  {#each $visibleColumns as column}
    <SheetCell
      {rowHovered}
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
  }
  .row:hover :global(.cell) {
    cursor: pointer;
  }
</style>
