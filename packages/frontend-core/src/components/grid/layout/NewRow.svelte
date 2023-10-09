<script>
  import { getContext, onDestroy, onMount, tick } from "svelte"
  import { Icon, Button, TempTooltip, TooltipType } from "@budibase/bbui"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import { fade } from "svelte/transition"
  import { GutterWidth } from "../lib/constants"
  import { NewRowID } from "../lib/constants"
  import GutterCell from "../cells/GutterCell.svelte"
  import KeyboardShortcut from "./KeyboardShortcut.svelte"

  const {
    hoveredRowId,
    focusedCellId,
    stickyColumn,
    scroll,
    dispatch,
    rows,
    focusedCellAPI,
    datasource,
    subscribe,
    renderedRows,
    renderedColumns,
    rowHeight,
    hasNextPage,
    maxScrollTop,
    rowVerticalInversionIndex,
    columnHorizontalInversionIndex,
    selectedRows,
    loading,
    config,
  } = getContext("grid")

  let visible = false
  let isAdding = false
  let newRow = {}
  let offset = 0

  $: firstColumn = $stickyColumn || $renderedColumns[0]
  $: width = GutterWidth + ($stickyColumn?.width || 0)
  $: $datasource, (visible = false)
  $: invertY = shouldInvertY(offset, $rowVerticalInversionIndex, $renderedRows)
  $: selectedRowCount = Object.values($selectedRows).length
  $: hasNoRows = !$rows.length

  const shouldInvertY = (offset, inversionIndex, rows) => {
    if (offset === 0) {
      return false
    }
    return rows.length >= inversionIndex
  }

  const addRow = async () => {
    // Blur the active cell and tick to let final value updates propagate
    isAdding = true
    $focusedCellId = null
    await tick()

    // Create row
    const newRowIndex = offset ? undefined : 0
    const savedRow = await rows.actions.addRow(newRow, newRowIndex)
    if (savedRow) {
      // Reset state
      clear()

      // Select the first cell if possible
      if (firstColumn) {
        $focusedCellId = `${savedRow._id}-${firstColumn.name}`
      }
    }
    isAdding = false
  }

  const clear = () => {
    isAdding = false
    visible = false
    $focusedCellId = null
    $hoveredRowId = null
    document.removeEventListener("keydown", handleKeyPress)
  }

  const startAdding = async () => {
    // Attempt to submit if already adding a row
    if (visible && !isAdding) {
      await addRow()
      return
    }
    if (visible || !firstColumn) {
      return
    }

    // If we have a next page of data then we aren't truly at the bottom, so we
    // render the add row component at the top
    if ($hasNextPage) {
      offset = 0
    }

    // If we don't have a next page then we're at the bottom and can scroll to
    // the max available offset
    else {
      scroll.update(state => ({
        ...state,
        top: $maxScrollTop,
      }))
      offset = $renderedRows.length * $rowHeight - ($maxScrollTop % $rowHeight)
      if ($renderedRows.length !== 0) {
        offset -= 1
      }
    }

    // Update state and select initial cell
    newRow = {}
    visible = true
    $hoveredRowId = NewRowID
    if (firstColumn) {
      $focusedCellId = `${NewRowID}-${firstColumn.name}`
    }

    // Attach key listener
    document.addEventListener("keydown", handleKeyPress)
  }

  const updateValue = ({ column, value }) => {
    newRow[column] = value
  }

  const addViaModal = () => {
    clear()
    dispatch("add-row")
  }

  const handleKeyPress = e => {
    if (!visible) {
      return
    }
    if (e.key === "Escape") {
      // Only close the new row component if we aren't actively inside a cell
      if (!$focusedCellAPI?.isActive()) {
        e.preventDefault()
        clear()
      }
    }
  }

  onMount(() => subscribe("add-row-inline", startAdding))
  onDestroy(() => {
    document.removeEventListener("keydown", handleKeyPress)
  })
</script>

<!-- New row FAB -->
<TempTooltip
  text="Click here to create your first row"
  condition={hasNoRows && !$loading}
  type={TooltipType.Info}
>
  {#if !visible && !selectedRowCount && $config.canAddRows}
    <div
      class="new-row-fab"
      on:click={() => dispatch("add-row-inline")}
      transition:fade|local={{ duration: 130 }}
      class:offset={!$stickyColumn}
    >
      <Icon name="Add" size="S" />
    </div>
  {/if}
</TempTooltip>

<!-- Only show new row functionality if we have any columns -->
{#if visible}
  <div
    class="container"
    class:floating={offset > 0}
    style="--offset:{offset}px; --sticky-width:{width}px;"
  >
    <div class="underlay sticky" transition:fade|local={{ duration: 130 }} />
    <div class="underlay" transition:fade|local={{ duration: 130 }} />
    <div class="sticky-column" transition:fade|local={{ duration: 130 }}>
      <GutterCell expandable on:expand={addViaModal} rowHovered>
        <Icon name="Add" color="var(--spectrum-global-color-gray-500)" />
        {#if isAdding}
          <div in:fade={{ duration: 130 }} class="loading-overlay" />
        {/if}
      </GutterCell>
      {#if $stickyColumn}
        {@const cellId = `${NewRowID}-${$stickyColumn.name}`}
        <DataCell
          {cellId}
          rowFocused
          column={$stickyColumn}
          row={newRow}
          focused={$focusedCellId === cellId}
          width={$stickyColumn.width}
          {updateValue}
          topRow={offset === 0}
          {invertY}
        >
          {#if $stickyColumn?.schema?.autocolumn}
            <div class="readonly-overlay">Can't edit auto column</div>
          {/if}
          {#if isAdding}
            <div in:fade={{ duration: 130 }} class="loading-overlay" />
          {/if}
        </DataCell>
      {/if}
    </div>
    <div class="normal-columns" transition:fade|local={{ duration: 130 }}>
      <GridScrollWrapper scrollHorizontally attachHandlers>
        <div class="row">
          {#each $renderedColumns as column, columnIdx}
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
                topRow={offset === 0}
                invertX={columnIdx >= $columnHorizontalInversionIndex}
                {invertY}
              >
                {#if column?.schema?.autocolumn}
                  <div class="readonly-overlay">Can't edit auto column</div>
                {/if}
                {#if isAdding}
                  <div in:fade={{ duration: 130 }} class="loading-overlay" />
                {/if}
              </DataCell>
            {/key}
          {/each}
        </div>
      </GridScrollWrapper>
    </div>
    <div class="buttons" transition:fade|local={{ duration: 130 }}>
      <Button size="M" cta on:click={addRow} disabled={isAdding}>
        <div class="button-with-keys">
          Save
          <KeyboardShortcut overlay keybind="Ctrl+Enter" />
        </div>
      </Button>
      <Button size="M" secondary newStyles on:click={clear}>
        <div class="button-with-keys">
          Cancel
          <KeyboardShortcut keybind="Esc" />
        </div>
      </Button>
    </div>
  </div>
{/if}

<style>
  /* New row FAB */
  .new-row-fab {
    position: absolute;
    top: var(--default-row-height);
    left: calc(var(--gutter-width) / 2);
    transform: translateX(6px) translateY(-50%);
    background: var(--cell-background);
    padding: 4px;
    border-radius: 50%;
    border: var(--cell-border);
    z-index: 10;
  }
  .new-row-fab:hover {
    background: var(--cell-background-hover);
    cursor: pointer;
  }
  .new-row-fab.offset {
    margin-left: -6px;
  }

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
  .container.floating :global(.cell) {
    height: calc(var(--row-height) + 1px);
    border-top: var(--cell-border);
  }

  /* Underlay sits behind everything */
  .underlay {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: var(--cell-background);
    opacity: 0.8;
  }
  .underlay.sticky {
    z-index: 2;
    width: var(--sticky-width);
  }

  /* Floating buttons which sit on top of the underlay but below the sticky column */
  .buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    pointer-events: all;
    z-index: 3;
    position: absolute;
    top: calc(var(--row-height) + var(--offset) + 24px);
    left: 18px;
  }
  .button-with-keys {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .button-with-keys :global(> div) {
    padding-top: 2px;
  }

  /* Sticky column styles */
  .sticky-column {
    display: flex;
    z-index: 4;
    position: relative;
    align-self: flex-start;
    flex: 0 0 var(--sticky-width);
  }
  .sticky-column :global(.cell:not(:last-child)) {
    border-right: none;
  }
  .sticky-column,
  .normal-columns {
    margin-top: var(--offset);
  }

  /* Normal column styles */
  .row {
    width: 0;
    display: flex;
  }

  /*  Readonly cell overlay */
  .readonly-overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--row-height);
    width: 100%;
    padding: var(--cell-padding);
    font-style: italic;
    color: var(--spectrum-global-color-gray-600);
    z-index: 1;
    user-select: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /*  Overlay while row is being added */
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--row-height);
    width: 100%;
    z-index: 1;
    background: var(--spectrum-global-color-gray-400);
    opacity: 0.25;
  }
</style>
