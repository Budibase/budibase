<script>
  import SheetCell from "./cells/SheetCell.svelte"
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import { getCellRenderer } from "./renderers"

  const {
    visibleColumns,
    hoveredRowId,
    rows,
    selectedCellId,
    reorder,
    stickyColumn,
  } = getContext("sheet")

  let isAdding = false
  let newRow = {}

  $: rowHovered = $hoveredRowId === "new"
  $: width = 40 + ($stickyColumn?.width || 0)

  const addRow = async field => {
    // const newRow = await rows.actions.addRow()
    // if (newRow) {
    //   $selectedCellId = `${newRow._id}-${field.name}`
    // }
  }

  $: console.log(newRow)

  const startAdding = () => {
    if (isAdding) {
      return
    }
    newRow = {}
    isAdding = true
  }
</script>

<div class="new" on:click={startAdding}>
  {#if !isAdding}
    <div class="add">
      <div class="icon">
        <Icon name="Add" size="S" />
      </div>
      <div class="text">Add row</div>
    </div>
  {:else}
    <div class="sticky" style="flex: 0 0 {width}px">
      <SheetCell width="40" center>
        <Icon name="Add" size="S" />
      </SheetCell>
      {#if $stickyColumn}
        {@const cellId = `new-${$stickyColumn.name}`}
        <SheetCell
          width={$stickyColumn.width}
          selected={$selectedCellId === cellId}
          on:click={() => ($selectedCellId = cellId)}
        >
          <svelte:component
            this={getCellRenderer($stickyColumn)}
            value={newRow[$stickyColumn.name]}
            schema={$stickyColumn.schema}
            selected={$selectedCellId === cellId}
            onChange={val => (newRow[$stickyColumn.name] = val)}
            readonly={$stickyColumn.schema.autocolumn}
          />
        </SheetCell>
      {/if}
    </div>
    <SheetScrollWrapper scrollVertically={false}>
      <div class="row">
        {#each $visibleColumns as column}
          {@const cellId = `new-${column.name}`}
          <SheetCell
            width={column.width}
            selected={$selectedCellId === cellId}
            on:click={() => ($selectedCellId = cellId)}
          >
            <svelte:component
              this={getCellRenderer(column)}
              value={newRow[column.name]}
              schema={column.schema}
              selected={$selectedCellId === cellId}
              onChange={val => (newRow[column.name] = val)}
              readonly={column.schema.autocolumn}
            />
          </SheetCell>
        {/each}
      </div>
    </SheetScrollWrapper>
  {/if}
</div>

<style>
  .new {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(16px + var(--cell-height));
    padding-bottom: 16px;
    z-index: 1;
    background: var(--cell-background);
    border-top: var(--cell-border);
  }

  .add {
    flex: 1 1 auto;
    display: flex;
  }
  .add:hover {
    cursor: pointer;
    background: var(--cell-background-hover);
  }
  .add .icon {
    flex: 0 0 40px;
    display: grid;
    place-items: center;
  }
  .add .text {
    flex: 1 1 auto;
    padding: var(--cell-padding);
  }

  .new :global(.cell) {
    cursor: pointer;
  }

  .sticky {
    z-index: 2;
    display: flex;
  }
  /* Don't show borders between cells in the sticky column */
  .sticky :global(.cell:not(:last-child)) {
    border-right: none;
  }

  .row {
    width: 0;
    display: flex;
  }
</style>
