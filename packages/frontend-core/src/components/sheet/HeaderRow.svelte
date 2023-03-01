<script>
  import SheetCell from "./SheetCell.svelte"
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"
  import { getIconForField } from "./utils"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"

  const { visibleColumns, reorder, selectedRows, rows } =
    getContext("spreadsheet")
</script>

<div>
  <SheetScrollWrapper scrollVertically={false} wheelInteractive={false}>
    <div class="row">
      {#each $visibleColumns as column}
        <SheetCell
          header
          reorderSource={$reorder.columnIdx === column.idx}
          reorderTarget={$reorder.swapColumnIdx === column.idx}
          on:mousedown={e => reorder.actions.startReordering(column.idx, e)}
          width={column.width}
          left={column.left}
        >
          <Icon
            size="S"
            name={getIconForField(column)}
            color="var(--spectrum-global-color-gray-600)"
          />
          <span>
            {column.name}
          </span>
        </SheetCell>
      {/each}
    </div>
  </SheetScrollWrapper>
</div>

<style>
  .row {
    display: flex;
    position: sticky;
    top: 0;
    width: inherit;
    z-index: 10;
    height: var(--cell-height);
  }
  .row :global(> :last-child) {
    border-right-width: 1px;
  }
</style>
