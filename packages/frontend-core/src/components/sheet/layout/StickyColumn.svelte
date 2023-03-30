<script>
  import { getContext } from "svelte"
  import { Checkbox, Icon } from "@budibase/bbui"
  import SheetCell from "../cells/SheetCell.svelte"
  import DataCell from "../cells/DataCell.svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import HeaderCell from "../cells/HeaderCell.svelte"

  const {
    rows,
    selectedRows,
    stickyColumn,
    renderedRows,
    selectedCellId,
    hoveredRowId,
    scroll,
    reorder,
    config,
    selectedCellMap,
    selectedCellRow,
    gutterWidth,
    dispatch,
  } = getContext("sheet")

  $: scrollLeft = $scroll.left
  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: width = gutterWidth + ($stickyColumn?.width || 0)

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
  class:scrolled={scrollLeft > 0}
>
  <div class="header row">
    <SheetCell width={gutterWidth}>
      <div class="gutter">
        <div class="checkbox visible">
          {#if $config.allowSelectRows}
            <div on:click={$config.allowSelectRows && selectAll}>
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
    <SheetScrollWrapper scrollHorizontally={false}>
      {#each $renderedRows as row, idx}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const containsSelectedRow = $selectedCellRow?._id === row._id}
        <div
          class="row"
          on:mouseenter={() => ($hoveredRowId = row._id)}
          on:mouseleave={() => ($hoveredRowId = null)}
        >
          <SheetCell
            width={gutterWidth}
            rowSelected={rowSelected || containsSelectedRow}
            {rowHovered}
          >
            <div class="gutter">
              <div
                on:click={() => selectRow(row._id)}
                class="checkbox"
                class:visible={$config.allowSelectRows &&
                  (rowSelected || rowHovered || containsSelectedRow)}
              >
                <Checkbox value={rowSelected} />
              </div>
              <div
                class="number"
                class:visible={!$config.allowSelectRows ||
                  !(rowSelected || rowHovered || containsSelectedRow)}
              >
                {row.__idx + 1}
              </div>
              {#if $config.allowExpandRows}
                <div
                  class="expand"
                  class:visible={containsSelectedRow || rowHovered}
                >
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
            {@const cellId = `${row._id}-${$stickyColumn.name}`}
            <DataCell
              rowSelected={rowSelected || containsSelectedRow}
              {rowHovered}
              rowIdx={idx}
              selected={$selectedCellId === cellId}
              selectedUser={$selectedCellMap[cellId]}
              width={$stickyColumn.width}
              reorderTarget={$reorder.targetColumn === $stickyColumn.name}
              column={$stickyColumn}
              {row}
              {cellId}
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
  }

  /* Add shadow when scrolled */
  .sticky-column.scrolled :global(.cell:last-child:after) {
    content: " ";
    position: absolute;
    width: 10px;
    height: 100%;
    left: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
  }

  /* Don't show borders between cells in the sticky column */
  .sticky-column :global(.cell:not(:last-child)) {
    border-right: none;
  }

  .header {
    position: relative;
    z-index: 2;
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
    z-index: 1;
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
