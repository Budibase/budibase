<script>
  import SheetCell from "./SheetCell.svelte"
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"
  import { getIconForField } from "./utils"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"

  const { visibleColumns, reorder } = getContext("spreadsheet")
</script>

<div class="header">
  <SheetScrollWrapper scrollVertically={false} wheelInteractive={false}>
    <div class="row">
      {#each $visibleColumns as column}
        <SheetCell
          header
          reorderSource={$reorder.sourceColumn === column.name}
          reorderTarget={$reorder.targetColumn === column.name}
          on:mousedown={e => reorder.actions.startReordering(column.name, e)}
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
  .header {
    background: var(--background);
    border-bottom: var(--cell-border);
    position: relative;
    z-index: 1;
  }
  .row {
    display: flex;
  }
</style>
