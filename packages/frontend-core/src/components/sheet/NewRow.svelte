<script>
  import SheetCell from "./SheetCell.svelte"
  import { Icon } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { visibleColumns, cellHeight, rows, selectedCellId } =
    getContext("spreadsheet")

  const addRow = async field => {
    const newRow = await rows.actions.addRow()
    if (newRow) {
      $selectedCellId = `${newRow._id}-${field.name}`
    }
  }
</script>

<div class="row new" style="--top:{($rows.length + 1) * cellHeight}px;">
  <SheetCell label on:click={addRow} width="40" left="0">
    <Icon hoverable name="Add" size="S" />
  </SheetCell>
  {#each $visibleColumns as column}
    <SheetCell
      sticky={column.idx === 0}
      on:click={() => addRow(column)}
      width={column.width}
      left={column.left}
    />
  {/each}
</div>

<style>
  .row {
    display: flex;
    top: var(--top);
    width: inherit;
    position: absolute;
  }
  :global(.sheet:not(.is-resizing):not(.is-reordering) .row:hover .cell) {
    background: var(--cell-background-hover);
    cursor: pointer;
  }
  .row :global(> :last-child) {
    border-right-width: 1px;
  }
</style>
