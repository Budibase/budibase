<script>
  import SheetCell from "./SheetCell.svelte"
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"
  import { getIconForField } from "./utils"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"

  const { visibleColumns, reorder, dispatch } = getContext("spreadsheet")
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
  <div class="add-column" on:click={() => dispatch("add-column")}>
    <SheetCell header width={40} center>
      <Icon name="Add" size="S" />
    </SheetCell>
  </div>
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
  .add-column {
    width: 40px;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
    border-left: 2px solid var(--spectrum-global-color-gray-200);
  }
</style>
