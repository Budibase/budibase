<script>
  import GridCell from "../cells/GridCell.svelte"
  import { getContext, onMount, tick } from "svelte"
  import { Icon, Button } from "@budibase/bbui"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import { fade } from "svelte/transition"
  import { GutterWidth } from "../lib/constants"

  export let animate = false
  export let rowIdx = 0

  const {
    hoveredRowId,
    focusedCellId,
    stickyColumn,
    config,
    dispatch,
    rows,
    focusedCellAPI,
    tableId,
    subscribe,
    renderedColumns,
    focusedRow,
    reorder,
  } = getContext("grid")

  let isAdding = false
  let newRow = { _id: `new${rowIdx}` }
  let touched = false

  $: rowId = `new${rowIdx}`
  $: firstColumn = $stickyColumn || $renderedColumns[0]
  $: width = GutterWidth + ($stickyColumn?.width || 0)
  $: $tableId, (isAdding = false)
  $: rowHovered = $hoveredRowId === rowId
  $: rowFocused = $focusedRow?._id === rowId
  $: reorderSource = $reorder.sourceColumn

  const addRow = async () => {
    // Create row
    const savedRow = await rows.actions.addRow(newRow, rowIdx)
    if (savedRow) {
      // Select the first cell if possible
      if (firstColumn) {
        $focusedCellId = `${savedRow._id}-${firstColumn.name}`
      }

      // Reset state
      isAdding = false
      newRow = {}
    }
  }

  const cancel = () => {
    newRow = { _id: rowId }
    isAdding = false
    $focusedCellId = null
    $hoveredRowId = null
  }

  const startAdding = async () => {
    isAdding = true
    $hoveredRowId = rowId
    if (firstColumn) {
      $focusedCellId = `${rowId}-${firstColumn.name}`

      // Also focus the cell if it is a text-like cell
      if (["string", "number"].includes(firstColumn.schema.type)) {
        await tick()
        $focusedCellAPI?.focus()
      }
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
<div
  class="container"
  transition:fade={{ duration: 130 }}
  on:focus
  on:mouseenter={() => ($hoveredRowId = rowId)}
  on:mouseleave={() => ($hoveredRowId = null)}
>
  <div class="sticky-column" style="flex: 0 0 {width}px">
    <GridCell width={GutterWidth} highlighted={rowHovered || rowFocused}>
      <div class="gutter">
        <div class="number">
          <Icon name="Add" />
        </div>
        {#if $config.allowExpandRows}
          <div class="expand" class:visible={rowFocused || rowHovered}>
            <Icon name="Maximize" size="S" hoverable on:click={addViaModal} />
          </div>
        {/if}
      </div>
    </GridCell>
    {#if $stickyColumn}
      {@const cellId = `${rowId}-${$stickyColumn.name}`}
      <DataCell
        {cellId}
        {rowFocused}
        highlighted={rowHovered || rowFocused}
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
    <div class="row">
      {#each $renderedColumns as column}
        {@const cellId = `${rowId}-${column.name}`}
        {#key cellId}
          <DataCell
            {cellId}
            {column}
            {updateValue}
            {rowFocused}
            highlighted={rowHovered ||
              rowFocused ||
              reorderSource === column.name}
            row={newRow}
            focused={$focusedCellId === cellId}
            width={column.width}
            rowIdx={0}
          />
        {/key}
      {/each}
    </div>
  </GridScrollWrapper>
  {#if Object.keys(newRow || {}).length > 1}
    <div class="buttons" in:fade={{ duration: 130 }}>
      <Button size="M" cta on:click={addRow}>Save</Button>
      <Button size="M" secondary newStyles on:click={cancel}>Cancel</Button>
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
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
    left: var(--gutter-width);
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
  .expand {
    opacity: 0;
    pointer-events: none;
  }
  .expand.visible {
    opacity: 1;
    pointer-events: all;
  }

  /* Normal column styles */
  .row {
    width: 0;
    display: flex;
  }
</style>
