<script>
  import GridCell from "../cells/GridCell.svelte"
  import { getContext, onMount } from "svelte"
  import { Icon, Button } from "@budibase/bbui"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import { fly } from "svelte/transition"
  import { GutterWidth } from "../lib/constants"

  const {
    hoveredRowId,
    focusedCellId,
    stickyColumn,
    scroll,
    config,
    dispatch,
    visibleColumns,
    rows,
    showHScrollbar,
    tableId,
    subscribe,
    scrollLeft,
  } = getContext("grid")

  let isAdding = false
  let newRow = {}
  let touched = false

  $: firstColumn = $stickyColumn || $visibleColumns[0]
  $: rowHovered = $hoveredRowId === "new"
  $: rowFocused = $focusedCellId?.startsWith("new-")
  $: width = GutterWidth + ($stickyColumn?.width || 0)
  $: $tableId, (isAdding = false)

  const addRow = async () => {
    // Create row
    const savedRow = await rows.actions.addRow(newRow, 0)
    if (savedRow) {
      // Select the first cell if possible
      if (firstColumn) {
        $focusedCellId = `${savedRow._id}-${firstColumn.name}`
      }

      // Reset state
      isAdding = false
      scroll.set({
        left: 0,
        top: 0,
      })
    }
  }

  const cancel = () => {
    isAdding = false
  }

  const startAdding = () => {
    newRow = {}
    isAdding = true
    if (firstColumn) {
      $focusedCellId = `new-${firstColumn.name}`
    }
  }

  const updateValue = (rowId, columnName, val) => {
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
{#if isAdding}
  <div class="container" transition:fly={{ y: 20, duration: 130 }}>
    <div class="content" class:above-scrollbar={$showHScrollbar}>
      <div
        class="new-row"
        on:mouseenter={() => ($hoveredRowId = "new")}
        on:mouseleave={() => ($hoveredRowId = null)}
      >
        <div
          class="sticky-column"
          style="flex: 0 0 {width}px"
          class:scrolled={$scrollLeft > 0}
        >
          <GridCell width={GutterWidth} {rowHovered} {rowFocused}>
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
          </GridCell>
          {#if $stickyColumn}
            {@const cellId = `new-${$stickyColumn.name}`}
            <DataCell
              {cellId}
              column={$stickyColumn}
              row={newRow}
              {rowHovered}
              focused={$focusedCellId === cellId}
              {rowFocused}
              width={$stickyColumn.width}
              {updateValue}
              rowIdx={0}
            />
          {/if}
        </div>

        <GridScrollWrapper scrollHorizontally wheelInteractive>
          <div class="row">
            {#each $visibleColumns as column}
              {@const cellId = `new-${column.name}`}
              {#key cellId}
                <DataCell
                  {cellId}
                  {column}
                  row={newRow}
                  {rowHovered}
                  focused={$focusedCellId === cellId}
                  {rowFocused}
                  width={column.width}
                  {updateValue}
                  rowIdx={0}
                />
              {/key}
            {/each}
          </div>
        </GridScrollWrapper>
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
    top: var(--row-height);
    left: 0;
    width: 100%;
    padding-bottom: 800px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .container:before {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: var(--cell-background);
    opacity: 0.8;
    z-index: -1;
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
  .new-row :global(.cell) {
    --cell-background: var(--background) !important;
    border-bottom: none;
  }

  .sticky-column {
    display: flex;
    z-index: 1;
    position: relative;
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
  .sticky-column.scrolled {
    /*box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);*/
  }
  .sticky-column.scrolled:after {
    content: "";
    width: 10px;
    height: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.05), transparent);
    left: 100%;
    top: 0;
    position: absolute;
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
    margin: 24px 0 0 var(--gutter-width);
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
