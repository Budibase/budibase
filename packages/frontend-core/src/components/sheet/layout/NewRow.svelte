<script>
  import SheetCell from "../cells/SheetCell.svelte"
  import { getContext } from "svelte"
  import { Icon, Button } from "@budibase/bbui"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import DataCell from "../cells/DataCell.svelte"

  const {
    renderedColumns,
    hoveredRowId,
    selectedCellId,
    stickyColumn,
    gutterWidth,
    scroll,
    config,
    dispatch,
    visibleColumns,
    rows,
    wheel,
    showHScrollbar,
    tableId,
  } = getContext("sheet")

  let isAdding = false
  let newRow = {}
  let touched = false

  $: firstColumn = $stickyColumn || $visibleColumns[0]
  $: rowHovered = $hoveredRowId === "new"
  $: containsSelectedCell = $selectedCellId?.startsWith("new-")
  $: width = gutterWidth + ($stickyColumn?.width || 0)
  $: scrollLeft = $scroll.left
  $: $tableId, (isAdding = false)

  const addRow = async () => {
    const savedRow = await rows.actions.addRow(newRow)
    if (savedRow && firstColumn) {
      $selectedCellId = `${savedRow._id}-${firstColumn.name}`
      isAdding = false
    }
  }

  const cancel = () => {
    isAdding = false
  }

  const startAdding = () => {
    newRow = {}
    isAdding = true
  }

  const updateRow = (rowId, columnName, val) => {
    touched = true
    newRow[columnName] = val
  }

  const addViaModal = () => {
    isAdding = false
    dispatch("add-row")
  }
</script>

<!-- Only show new row functionality if we have any columns -->
{#if firstColumn}
  <div
    class="add-button"
    class:visible={!isAdding}
    class:above-scrollbar={$showHScrollbar}
  >
    <Button size="M" cta icon="Add" on:click={startAdding}>Add row</Button>
  </div>

  <div class="container" class:visible={isAdding}>
    <div class="buttons">
      <Button size="M" cta on:click={addRow}>Save</Button>
      <Button size="M" secondary newStyles on:click={cancel}>Cancel</Button>
    </div>
    <div class="content" class:above-scrollbar={$showHScrollbar}>
      <div
        class="new-row"
        on:mouseenter={() => ($hoveredRowId = "new")}
        on:mouseleave={() => ($hoveredRowId = null)}
      >
        <div
          class="sticky-column"
          style="flex: 0 0 {width}px"
          class:scrolled={scrollLeft > 0}
        >
          <SheetCell
            width={gutterWidth}
            {rowHovered}
            rowSelected={containsSelectedCell}
          >
            <div class="gutter">
              {#if $config.allowExpandRows}
                <Icon
                  name="Maximize"
                  size="S"
                  hoverable
                  on:click={addViaModal}
                />
              {/if}
            </div>
          </SheetCell>
          {#if $stickyColumn}
            {@const cellId = `new-${$stickyColumn.name}`}
            <DataCell
              {cellId}
              column={$stickyColumn}
              row={newRow}
              {rowHovered}
              selected={$selectedCellId === cellId}
              rowSelected={containsSelectedCell}
              width={$stickyColumn.width}
              {updateRow}
              showPlaceholder
              invert
            />
          {/if}
        </div>
        <SheetScrollWrapper scrollVertically={false}>
          <div class="row">
            {#each $renderedColumns as column}
              {@const cellId = `new-${column.name}`}
              <DataCell
                {cellId}
                {column}
                row={newRow}
                {rowHovered}
                selected={$selectedCellId === cellId}
                rowSelected={containsSelectedCell}
                width={column.width}
                {updateRow}
                showPlaceholder
                invert
              />
            {/each}
          </div>
        </SheetScrollWrapper>
      </div>
    </div>
  </div>
{/if}

<style>
  .add-button {
    position: absolute;
    left: 16px;
    bottom: 16px;
    z-index: 1;
    transform: translateY(calc(16px + 100%));
    transition: transform 130ms ease-out;
  }
  .add-button.above-scrollbar {
    bottom: 32px;
  }
  .add-button.visible {
    transform: translateY(0);
  }

  .container {
    pointer-events: none;
    position: absolute;
    bottom: 0;
    transform: translateY(100%);
    z-index: 1;
    transition: transform 130ms ease-out;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--cell-background) 80%
    );
    width: 100%;
    padding-top: 64px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .container.visible {
    transform: translateY(0);
  }
  .content {
    pointer-events: all;
    background: var(--background);
    border-top: var(--cell-border);
  }
  .content.above-scrollbar {
    padding: 0 0 24px 0;
  }

  .new-row {
    display: flex;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: margin-bottom 130ms ease-out;
  }
  .new-row.visible {
    margin-bottom: 0;
  }
  .new-row :global(.cell) {
    --cell-background: var(--background) !important;
  }

  .sticky-column {
    display: flex;
    z-index: 1;
  }
  /* Don't show borders between cells in the sticky column */
  .sticky-column :global(.cell:not(:last-child)) {
    border-right: none;
  }

  .row {
    width: 0;
    display: flex;
  }

  /* Add shadow when scrolled */
  .sticky.scrolled :global(.cell:last-child:after) {
    content: " ";
    position: absolute;
    width: 10px;
    height: 100%;
    left: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
  }

  /* Styles for gutter */
  .gutter {
    flex: 1 1 auto;
    display: grid;
    align-items: center;
    padding: var(--cell-padding);
    grid-template-columns: 1fr 16px;
    gap: var(--cell-spacing);
  }

  /* Floating buttons */
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin: 0 0 16px 16px;
    pointer-events: all;
    align-self: flex-start;
  }
</style>
