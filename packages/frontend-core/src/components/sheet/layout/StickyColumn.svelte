<script>
  import { getContext } from "svelte"
  import { Checkbox, Icon } from "@budibase/bbui"
  import SheetCell from "../cells/SheetCell.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"
  import { GutterWidth } from "../lib/constants"

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
    dispatch,
    scrollLeft,
  } = getContext("sheet")

  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
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

  const selectRow = id => {
    selectedRows.update(state => {
      let newState = {
        ...state,
        [id]: !state[id],
      }
      if (!newState[id]) {
        delete newState[id]
      }
      return newState
    })
  }
</script>

<div
  class="sticky-column"
  style="flex: 0 0 {width}px"
  class:scrolled={$scrollLeft > 0}
>
  <div class="header row">
    <SheetCell width={GutterWidth}>
      <div class="gutter">
        <div class="checkbox visible">
          {#if $config.allowDeleteRows}
            <div on:click={selectAll}>
              <Checkbox
                value={rowCount && selectedRowCount === rowCount}
                disabled={!$renderedRows.length}
              />
            </div>
          {/if}
        </div>
        {#if $config.allowExpandRows}
          <div class="expand">
            <Icon name="Maximize" size="S" />
          </div>
        {/if}
      </div>
    </SheetCell>

    {#if $stickyColumn}
      <HeaderCell column={$stickyColumn} orderable={false} />
    {/if}
  </div>

  <div class="content" on:mouseleave={() => ($hoveredRowId = null)}>
    <SheetScrollWrapper scrollVertically wheelInteractive>
      {#each $renderedRows as row, idx}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const rowFocused = $focusedRow?._id === row._id}
        {@const cellId = `${row._id}-${$stickyColumn?.name}`}
        <div
          class="row"
          on:mouseenter={() => ($hoveredRowId = row._id)}
          on:mouseleave={() => ($hoveredRowId = null)}
        >
          <SheetCell
            width={GutterWidth}
            highlighted={rowFocused || rowHovered}
            selected={rowSelected}
          >
            <div class="gutter">
              <div
                on:click={() => selectRow(row._id)}
                class="checkbox"
                class:visible={$config.allowDeleteRows &&
                  (rowSelected || rowHovered || rowFocused)}
              >
                <Checkbox value={rowSelected} />
              </div>
              <div
                class="number"
                class:visible={!$config.allowDeleteRows ||
                  !(rowSelected || rowHovered || rowFocused)}
              >
                {row.__idx + 1}
              </div>
              {#if $config.allowExpandRows}
                <div class="expand" class:visible={rowFocused || rowHovered}>
                  <Icon
                    name="Maximize"
                    hoverable
                    size="S"
                    on:click={() => {
                      dispatch("edit-row", row)
                    }}
                  />
                </div>
              {/if}
            </div>
          </SheetCell>
          {#if $stickyColumn}
            <DataCell
              {row}
              {cellId}
              {rowFocused}
              selected={rowSelected}
              highlighted={rowHovered || rowFocused}
              rowIdx={idx}
              focused={$focusedCellId === cellId}
              selectedUser={$selectedCellMap[cellId]}
              width={$stickyColumn.width}
              column={$stickyColumn}
            />
          {/if}
        </div>
      {/each}
    </SheetScrollWrapper>
  </div>
</div>

<style>
  .sticky-column {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
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
    width: 16px;
    height: 100%;
    left: 100%;
    top: 0;
    opacity: 1;
    background: linear-gradient(to right, var(--drop-shadow), transparent);
    z-index: -1;
  }

  /* Don't show borders between cells in the sticky column */
  .sticky-column :global(.cell:not(:last-child)) {
    border-right: none;
  }

  .header {
    z-index: 1;
  }
  .header :global(.cell) {
    background: var(--spectrum-global-color-gray-100);
  }
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

  /* Styles for gutter */
  .gutter {
    flex: 1 1 auto;
    display: grid;
    align-items: center;
    padding: var(--cell-padding);
    grid-template-columns: 1fr auto;
    gap: var(--cell-spacing);
  }
  .checkbox,
  .number {
    display: none;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .number {
    color: var(--spectrum-global-color-gray-500);
  }
  .checkbox.visible,
  .number.visible {
    display: flex;
  }
  .expand {
    opacity: 0;
    pointer-events: none;
  }
  .expand.visible {
    opacity: 1;
    pointer-events: all;
  }
</style>
