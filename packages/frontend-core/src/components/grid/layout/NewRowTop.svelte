<script>
  import GridCell from "../cells/GridCell.svelte"
  import { getContext, onDestroy, onMount, tick } from "svelte"
  import { Icon, Button } from "@budibase/bbui"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import { fade } from "svelte/transition"
  import { GutterWidth } from "../lib/constants"
  import { NewRowID } from "../lib/constants"
  import GutterCell from "../cells/GutterCell.svelte"

  const {
    hoveredRowId,
    focusedCellId,
    stickyColumn,
    scroll,
    config,
    dispatch,
    rows,
    focusedCellAPI,
    tableId,
    subscribe,
    renderedColumns,
  } = getContext("grid")

  let isAdding = false
  let newRow = {}

  $: firstColumn = $stickyColumn || $renderedColumns[0]
  $: width = GutterWidth + ($stickyColumn?.width || 0)
  $: $tableId, (isAdding = false)

  const addRow = async () => {
    // Blur the active cell and tick to let final value updates propagate
    $focusedCellAPI?.blur()
    await tick()

    // Create row
    const savedRow = await rows.actions.addRow(newRow, 0)
    if (savedRow) {
      // Reset state
      scroll.update(state => ({
        ...state,
        top: 0,
      }))
      clear()

      // Select the first cell if possible
      if (firstColumn) {
        $focusedCellId = `${savedRow._id}-${firstColumn.name}`
      }
    }
  }

  const clear = () => {
    isAdding = false
    $focusedCellId = null
    $hoveredRowId = null
    document.removeEventListener("keydown", handleKeyPress)
  }

  const startAdding = async () => {
    if (isAdding) {
      return
    }
    document.addEventListener("keydown", handleKeyPress)
    newRow = {}
    isAdding = true
    $hoveredRowId = NewRowID
    if (firstColumn) {
      $focusedCellId = `${NewRowID}-${firstColumn.name}`
    }
  }

  const updateValue = (rowId, columnName, val) => {
    newRow[columnName] = val
  }

  const addViaModal = () => {
    clear()
    dispatch("add-row")
  }

  const handleKeyPress = e => {
    if (!isAdding) {
      return
    }
    if (e.key === "Escape") {
      // Only close the new row component if we aren't actively inside a cell
      if (!$focusedCellAPI?.isActive()) {
        e.preventDefault()
        clear()
      }
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      addRow()
    }
  }

  onMount(() => subscribe("add-row-inline", startAdding))
  onDestroy(() => {
    document.removeEventListener("keydown", handleKeyPress)
  })
</script>

<!-- Only show new row functionality if we have any columns -->
{#if isAdding}
  <div class="container">
    <div
      class="underlay sticky"
      style="width:{width}px;"
      transition:fade={{ duration: 130 }}
    />
    <div class="underlay" transition:fade={{ duration: 130 }} />
    <div
      class="sticky-column"
      transition:fade={{ duration: 130 }}
      style="flex: 0 0 {width}px"
    >
      <GutterCell on:expand={addViaModal} rowHovered>
        <Icon name="Add" />
      </GutterCell>
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
    <GridScrollWrapper scrollHorizontally wheelInteractive>
      <div class="row" transition:fade={{ duration: 130 }}>
        {#each $renderedColumns as column}
          {@const cellId = `new-${column.name}`}
          {#key cellId}
            <DataCell
              {cellId}
              {column}
              {updateValue}
              rowFocused
              row={newRow}
              focused={$focusedCellId === cellId}
              width={column.width}
              rowIdx={0}
            />
          {/key}
        {/each}
      </div>
    </GridScrollWrapper>
    <div class="buttons" transition:fade={{ duration: 130 }}>
      <Button size="M" cta on:click={addRow}>Save</Button>
      <Button size="M" secondary newStyles on:click={clear}>Cancel</Button>
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
    --cell-background: var(--spectrum-global-color-gray-75) !important;
  }

  /* Underlay sits behind everything */
  .underlay {
    position: absolute;
    content: "";
    left: 0;
    top: var(--row-height);
    height: 100%;
    width: 100%;
    background: var(--cell-background);
    opacity: 0.8;
  }
  .underlay.sticky {
    z-index: 2;
  }

  /* Floating buttons which sit on top of the underlay but below the sticky column */
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    pointer-events: all;
    z-index: 3;
    position: absolute;
    top: calc(var(--row-height) + 24px);
    left: 32px;
  }

  /* Sticky column styles */
  .sticky-column {
    display: flex;
    z-index: 4;
    position: relative;
    align-self: flex-start;
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
  .row {
    width: 0;
    display: flex;
  }
</style>
