<script>
  import GridCell from "../cells/GridCell.svelte"
  import { getContext, onMount } from "svelte"
  import { Icon, Button } from "@budibase/bbui"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import { fade } from "svelte/transition"
  import { GutterWidth } from "../lib/constants"

  const {
    hoveredRowId,
    focusedCellId,
    stickyColumn,
    scroll,
    config,
    dispatch,
    rows,
    showHScrollbar,
    tableId,
    subscribe,
    renderedColumns,
    scrollLeft,
  } = getContext("grid")

  let isAdding = false
  let newRow = {}
  let touched = false

  $: firstColumn = $stickyColumn || $renderedColumns[0]
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
    $focusedCellId = null
    $hoveredRowId = null
  }

  const startAdding = () => {
    newRow = {}
    isAdding = true
    $hoveredRowId = "new"
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

  const handleKeyPress = e => {
    if (!isAdding) {
      return
    }
    if (e.key === "Escape") {
      cancel()
    }
  }

  onMount(() => subscribe("add-row-inline", startAdding))
  onMount(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  })
</script>

<!-- Only show new row functionality if we have any columns -->
{#if isAdding}
  <div class="container">
    <div
      class="sticky-column"
      transition:fade={{ duration: 130 }}
      style="flex: 0 0 {width}px"
      class:scrolled={$scrollLeft > 0}
    >
      <GridCell width={GutterWidth} {rowHovered} rowFocused>
        <div class="gutter">
          <div class="number">1</div>
          {#if $config.allowExpandRows}
            <Icon name="Maximize" size="S" hoverable on:click={addViaModal} />
          {/if}
        </div>
      </GridCell>
      {#if $stickyColumn}
        {@const cellId = `new-${$stickyColumn.name}`}
        <DataCell
          {cellId}
          rowFocused
          column={$stickyColumn}
          row={newRow}
          focused={$focusedCellId === cellId}
          width={$stickyColumn.width}
          {updateValue}
          rowIdx={0}
        />
      {/if}
    </div>
    <div class="normal-columns" transition:fade={{ duration: 130 }}>
      <GridScrollWrapper scrollHorizontally wheelInteractive>
        <div class="row">
          {#each $renderedColumns as column}
            {@const cellId = `new-${column.name}`}
            {#key cellId}
              <DataCell
                {cellId}
                {column}
                {rowFocused}
                {rowHovered}
                {updateValue}
                row={newRow}
                focused={$focusedCellId === cellId}
                width={column.width}
                rowIdx={0}
              />
            {/key}
          {/each}
        </div>
      </GridScrollWrapper>
    </div>
    <div class="buttons" transition:fade={{ duration: 130 }}>
      <Button size="M" cta on:click={addRow}>Save</Button>
      <Button size="M" secondary newStyles on:click={cancel}>Cancel</Button>
    </div>
  </div>
{/if}

<style>
  .container {
    position: absolute;
    top: var(--default-row-height);
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  .container :global(.cell) {
    --cell-background: var(--spectrum-global-color-gray-100);
  }

  /* Add overlays independently behind both separate z-indexed column containers */
  .sticky-column:before,
  .normal-columns:before {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: var(--cell-background);
    opacity: 0.8;
  }

  /* Sticky column styles */
  .sticky-column {
    display: flex;
    z-index: 2;
    position: relative;
  }
  .sticky-column :global(.cell:not(:last-child)) {
    border-right: none;
  }
  .gutter {
    flex: 1 1 auto;
    display: grid;
    align-items: center;
    padding: var(--cell-padding);
    grid-template-columns: 1fr auto;
    gap: var(--cell-spacing);
  }
  .number {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--spectrum-global-color-gray-500);
  }

  /* Normal column styles */
  .normal-columns {
    flex: 1 1 auto;
  }
  .row {
    width: 0;
    display: flex;
  }

  /* Floating buttons */
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    pointer-events: all;
    z-index: 2;
    position: absolute;
    top: calc(var(--row-height) + 24px);
    left: var(--gutter-width);
  }
</style>
