<script>
  import { getContext, onDestroy, onMount, tick } from "svelte"
  import { Icon, Button, TempTooltip, TooltipType } from "@budibase/bbui"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import { fade } from "svelte/transition"
  import { GutterWidth, NewRowID } from "../lib/constants"
  import GutterCell from "../cells/GutterCell.svelte"
  import KeyboardShortcut from "./KeyboardShortcut.svelte"
  import { getCellID } from "../lib/utils"

  const {
    hoveredRowId,
    focusedCellId,
    displayColumn,
    scroll,
    dispatch,
    rows,
    focusedCellAPI,
    datasource,
    subscribe,
    renderedRows,
    scrollableColumns,
    rowHeight,
    hasNextPage,
    maxScrollTop,
    selectedRows,
    loaded,
    refreshing,
    config,
    filter,
    inlineFilters,
    columnRenderMap,
    visibleColumns,
    scrollTop,
  } = getContext("grid")

  let visible = false
  let isAdding = false
  let newRow
  let offset = 0

  $: firstColumn = $visibleColumns[0]
  $: width = GutterWidth + ($displayColumn?.width || 0)
  $: $datasource, (visible = false)
  $: selectedRowCount = Object.values($selectedRows).length
  $: hasNoRows = !$rows.length
  $: renderedRowCount = $renderedRows.length
  $: offset = getOffset($hasNextPage, renderedRowCount, $rowHeight, $scrollTop)

  const getOffset = (hasNextPage, rowCount, rowHeight, scrollTop) => {
    // If we have a next page of data then we aren't truly at the bottom, so we
    // render the add row component at the top
    if (hasNextPage) {
      return 0
    }
    offset = rowCount * rowHeight - (scrollTop % rowHeight)
    if (rowCount !== 0) {
      offset -= 1
    }
    return offset
  }

  const addRow = async () => {
    // Blur the active cell and tick to let final value updates propagate
    isAdding = true
    $focusedCellId = null
    await tick()

    // Create row
    const newRowIndex = offset ? undefined : 0
    let rowToCreate = { ...newRow }
    delete rowToCreate._isNewRow
    const savedRow = await rows.actions.addRow({
      row: rowToCreate,
      idx: newRowIndex,
    })
    if (savedRow) {
      // Reset state
      clear()

      // Select the first cell if possible
      if (firstColumn) {
        $focusedCellId = getCellID(savedRow._id, firstColumn.name)
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

    // If we don't have a next page then we're at the bottom and can scroll to
    // the max available offset
    if (!$hasNextPage) {
      scroll.update(state => ({
        ...state,
        top: $maxScrollTop,
      }))
    }

    // Update state and select initial cell
    newRow = { _isNewRow: true }
    visible = true
    $hoveredRowId = NewRowID
    if (firstColumn) {
      $focusedCellId = getCellID(NewRowID, firstColumn.name)
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
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<TempTooltip
  text="Click here to create your first row"
  condition={hasNoRows &&
    $loaded &&
    !$filter?.length &&
    !$inlineFilters?.length &&
    !$refreshing}
  type={TooltipType.Info}
>
  {#if !visible && !selectedRowCount && $config.canAddRows}
    <div
      class="new-row-fab"
      on:click={() => dispatch("add-row-inline")}
      transition:fade|local={{ duration: 130 }}
      class:offset={!$displayColumn}
    >
      <Icon name="Add" size="S" />
    </div>
  {/if}
</TempTooltip>

<!-- Only show new row functionality if we have any columns -->
{#if visible}
  <div
    class="new-row"
    class:floating={offset > 0}
    style="--offset:{offset}px; --sticky-width:{width}px;"
  >
    <div class="underlay sticky" transition:fade|local={{ duration: 130 }} />
    <div class="underlay" transition:fade|local={{ duration: 130 }} />
    <div class="sticky-column" transition:fade|local={{ duration: 130 }}>
      <div class="row">
        <GutterCell expandable on:expand={addViaModal} rowHovered>
          <Icon name="Add" color="var(--spectrum-global-color-gray-500)" />
          {#if isAdding}
            <div in:fade={{ duration: 130 }} class="loading-overlay" />
          {/if}
        </GutterCell>
        {#if $displayColumn}
          {@const cellId = getCellID(NewRowID, $displayColumn.name)}
          <DataCell
            {cellId}
            rowFocused
            column={$displayColumn}
            row={newRow}
            focused={$focusedCellId === cellId}
            width={$displayColumn.width}
            {updateValue}
            topRow={offset === 0}
          >
            {#if $displayColumn?.schema?.autocolumn}
              <div class="readonly-overlay">Can't edit auto column</div>
            {/if}
            {#if isAdding}
              <div in:fade={{ duration: 130 }} class="loading-overlay" />
            {/if}
          </DataCell>
        {/if}
      </div>
    </div>
    <div class="normal-columns" transition:fade|local={{ duration: 130 }}>
      <GridScrollWrapper scrollHorizontally attachHandlers>
        <div class="row">
          {#each $scrollableColumns as column}
            {@const cellId = getCellID(NewRowID, column.name)}
            <DataCell
              {cellId}
              {column}
              {updateValue}
              rowFocused
              row={newRow}
              focused={$focusedCellId === cellId}
              width={column.width}
              topRow={offset === 0}
              hidden={!$columnRenderMap[column.name]}
            >
              {#if column?.schema?.autocolumn}
                <div class="readonly-overlay">Can't edit auto column</div>
              {/if}
              {#if isAdding}
                <div in:fade={{ duration: 130 }} class="loading-overlay" />
              {/if}
            </DataCell>
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

  .new-row {
    position: absolute;
    top: var(--default-row-height);
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  .new-row :global(.cell) {
    --cell-background: var(--spectrum-global-color-gray-75) !important;
  }
  .new-row.floating :global(.cell) {
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
    top: calc(
      var(--row-height) + var(--offset) + var(--default-row-height) / 2
    );
    left: calc(var(--default-row-height) / 2);
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
