<script>
  import SheetCell from "../cells/SheetCell.svelte"
  import { getContext, onMount } from "svelte"
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
    subscribe,
    selectedCellAPI,
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
    const savedRow = await rows.actions.addRow(newRow, 0)
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
    if (firstColumn) {
      $selectedCellId = `new-${firstColumn.name}`
      setTimeout(() => {
        $selectedCellAPI?.focus()
      }, 100)
    }
  }

  const updateRow = (rowId, columnName, val) => {
    touched = true
    newRow[columnName] = val
  }

  const addViaModal = () => {
    isAdding = false
    dispatch("add-row")
  }

  onMount(() => subscribe("add-row-inline", startAdding))
</script>

<!-- Only show new row functionality if we have any columns -->
{#if firstColumn}
  <div
    class="container"
    class:visible={isAdding}
    on:wheel={wheel.actions.handleWheel}
  >
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
              <div class="number">1</div>
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
              />
            {/each}
          </div>
        </SheetScrollWrapper>
      </div>
    </div>
    <div class="buttons">
      <Button size="M" cta on:click={addRow}>Save</Button>
      <Button size="M" secondary newStyles on:click={cancel}>Cancel</Button>
    </div>
  </div>
{/if}

<style>
  .container {
    pointer-events: none;
    position: absolute;
    top: var(--cell-height);
    transform: translateY(-100%);
    z-index: 1;
    transition: transform 130ms ease-out;
    background: linear-gradient(
      to bottom,
      var(--cell-background) 20%,
      transparent 100%
    );
    width: 100%;
    padding-bottom: 64px;
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
    border-bottom: var(--cell-border);
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
    border-bottom: none;
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
    grid-template-columns: 1fr auto;
    gap: var(--cell-spacing);
  }

  /* Floating buttons */
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin: 16px 0 0 16px;
    pointer-events: all;
    align-self: flex-start;
  }

  .number {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--spectrum-global-color-gray-500);
  }
</style>
