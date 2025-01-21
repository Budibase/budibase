<script>
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"
  import GridCell from "../cells/GridCell.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"
  import { GutterWidth, BlankRowID } from "../lib/constants"
  import GutterCell from "../cells/GutterCell.svelte"
  import KeyboardShortcut from "./KeyboardShortcut.svelte"
  import { getCellID } from "../lib/utils"

  const {
    rows,
    selectedRows,
    displayColumn,
    renderedRows,
    focusedCellId,
    hoveredRowId,
    config,
    selectedCellMap,
    userCellMap,
    focusedRow,
    scrollLeft,
    dispatch,
    contentLines,
    isDragging,
    isSelectingCells,
    selectedCellCount,
  } = getContext("grid")

  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).length
  $: width = GutterWidth + ($displayColumn?.width || 0)

  const selectAll = () => {
    const allSelected = selectedRowCount === rowCount
    if (allSelected) {
      $selectedRows = {}
    } else {
      let allRows = {}
      $rows.forEach(row => {
        allRows[row._id] = true
      })
      $selectedRows = allRows
    }
  }
</script>

<div
  class="sticky-column"
  style="flex: 0 0 {width}px"
  class:scrolled={$scrollLeft > 0}
>
  <div class="header row">
    <GutterCell
      disableNumber
      on:select={selectAll}
      defaultHeight
      rowSelected={selectedRowCount && selectedRowCount === rowCount}
      disabled={!$renderedRows.length}
    />
    {#if $displayColumn}
      <HeaderCell column={$displayColumn} orderable={false} idx="sticky">
        <slot name="edit-column" />
      </HeaderCell>
    {/if}
  </div>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <GridScrollWrapper scrollVertically attachHandlers>
    {#each $renderedRows as row, idx}
      {@const rowSelected = !!$selectedRows[row._id]}
      {@const rowHovered =
        $hoveredRowId === row._id &&
        (!$selectedCellCount || !$isSelectingCells)}
      {@const rowFocused = $focusedRow?._id === row._id}
      {@const cellId = getCellID(row._id, $displayColumn?.name)}
      <div
        class="row"
        on:mouseenter={$isDragging ? null : () => ($hoveredRowId = row._id)}
        on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
        on:click={() => dispatch("rowclick", rows.actions.cleanRow(row))}
      >
        <GutterCell {row} {rowFocused} {rowHovered} {rowSelected} />
        {#if $displayColumn}
          <DataCell
            {row}
            {cellId}
            {rowFocused}
            {rowSelected}
            cellSelected={$selectedCellMap[cellId]}
            highlighted={rowHovered || rowFocused}
            rowIdx={row.__idx}
            topRow={idx === 0}
            focused={$focusedCellId === cellId}
            selectedUser={$userCellMap[cellId]}
            width={$displayColumn.width}
            column={$displayColumn}
            contentLines={$contentLines}
            isSelectingCells={$isSelectingCells}
          />
        {/if}
      </div>
    {/each}
    {#if $config.canAddRows}
      <div
        class="row blank"
        on:mouseenter={$isDragging ? null : () => ($hoveredRowId = BlankRowID)}
        on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
        on:click={() => dispatch("add-row-inline")}
      >
        <GutterCell rowHovered={$hoveredRowId === BlankRowID}>
          <Icon name="Add" color="var(--spectrum-global-color-gray-500)" />
        </GutterCell>
        {#if $displayColumn}
          <GridCell
            width={$displayColumn.width}
            highlighted={$hoveredRowId === BlankRowID}
          >
            <KeyboardShortcut padded keybind="Ctrl+Enter" />
          </GridCell>
        {/if}
      </div>
    {/if}
  </GridScrollWrapper>
</div>

<style>
  .sticky-column {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
    background: var(--cell-background);
  }

  /* Add right border */
  .sticky-column:before {
    position: absolute;
    content: "";
    width: 0;
    height: 100%;
    left: calc(100% - 1px);
    top: 0;
    border-left: var(--cell-border);
  }

  /* Add shadow when scrolled */
  .sticky-column.scrolled:after {
    position: absolute;
    content: "";
    width: 8px;
    height: 100%;
    left: 100%;
    top: 0;
    opacity: 1;
    background: linear-gradient(to right, var(--drop-shadow), transparent);
    z-index: -1;
  }

  /* Don't show borders between cells in the sticky column */
  .sticky-column :global(.cell:not(:last-child)) {
    border-right-color: transparent;
  }

  .header {
    z-index: 1;
  }
  .header :global(.cell) {
    background: var(--grid-background-alt);
  }
  .header :global(.cell::before) {
    display: none;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
  .blank :global(.cell:hover) {
    cursor: pointer;
  }
</style>
