<script>
  import { getContext } from "svelte"
  import { Icon, ProgressCircle } from "@budibase/bbui"
  import GridCell from "../cells/GridCell.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import GridScrollWrapper from "./GridScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"
  import { GutterWidth, BlankRowID } from "../lib/constants"
  import GutterCell from "../cells/GutterCell.svelte"
  import KeyboardShortcut from "./KeyboardShortcut.svelte"
  import { getCellID } from "../lib/utils"
  import { fade } from "svelte/transition"

  const {
    rows,
    selectedRows,
    stickyColumn,
    renderedRows,
    focusedCellId,
    hoveredRowId,
    config,
    selectedCellMap,
    focusedRow,
    scrollLeft,
    dispatch,
    contentLines,
    isDragging,
    loading,
  } = getContext("grid")

  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).length
  $: width = GutterWidth + ($stickyColumn?.width || 0)

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

    {#if $loading}
      <div
        class="loading-wrapper"
        in:fade|local={{ duration: 130 }}
        out:fade|local={{ duration: 130, delay: 500 }}
      >
        <GutterCell>
          <div class="loading-content">
            <ProgressCircle size="S" />
          </div>
        </GutterCell>
      </div>
    {/if}

    {#if $stickyColumn}
      <HeaderCell column={$stickyColumn} orderable={false} idx="sticky">
        <slot name="edit-column" />
      </HeaderCell>
    {/if}
  </div>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="content">
    <GridScrollWrapper scrollVertically attachHandlers>
      {#each $renderedRows as row, idx}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const rowFocused = $focusedRow?._id === row._id}
        {@const cellId = getCellID(row._id, $stickyColumn?.name)}
        <div
          class="row"
          on:mouseenter={$isDragging ? null : () => ($hoveredRowId = row._id)}
          on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
          on:click={() => dispatch("rowclick", rows.actions.cleanRow(row))}
        >
          <GutterCell {row} {rowFocused} {rowHovered} {rowSelected} />
          {#if $stickyColumn}
            <DataCell
              {row}
              {cellId}
              {rowFocused}
              selected={rowSelected}
              highlighted={rowHovered || rowFocused}
              rowIdx={row.__idx}
              topRow={idx === 0}
              focused={$focusedCellId === cellId}
              selectedUser={$selectedCellMap[cellId]}
              width={$stickyColumn.width}
              column={$stickyColumn}
              contentLines={$contentLines}
            />
          {/if}
        </div>
      {/each}
      {#if $config.canAddRows}
        <div
          class="row new"
          on:mouseenter={$isDragging
            ? null
            : () => ($hoveredRowId = BlankRowID)}
          on:mouseleave={$isDragging ? null : () => ($hoveredRowId = null)}
          on:click={() => dispatch("add-row-inline")}
        >
          <GutterCell rowHovered={$hoveredRowId === BlankRowID}>
            <Icon name="Add" color="var(--spectrum-global-color-gray-500)" />
          </GutterCell>
          {#if $stickyColumn}
            <GridCell
              width={$stickyColumn.width}
              highlighted={$hoveredRowId === BlankRowID}
            >
              <KeyboardShortcut padded keybind="Ctrl+Enter" />
            </GridCell>
          {/if}
        </div>
      {/if}
    </GridScrollWrapper>
  </div>
</div>

<style>
  .sticky-column {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
    background: var(--cell-background);
  }

  /* Loading spinner */
  .loading-wrapper {
    position: absolute;
    display: flex;
  }
  .loading-content {
    display: grid;
    place-items: center;
    padding-top: 2px;
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
  .sticky-column :global(.cell:not(:last-child)),
  .loading-wrapper :global(.cell) {
    border-right: none;
  }

  /* Copy header styles */
  .header {
    z-index: 1;
  }
  .header :global(.cell) {
    background: var(--grid-background-alt);
  }

  /* Copy body styles */
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }
  .content {
    position: relative;
    flex: 1 1 auto;
  }
  .row.new :global(*:hover) {
    cursor: pointer;
  }
</style>
