<script>
  import { getContext } from "svelte"
  import { Checkbox } from "@budibase/bbui"
  import SheetCell from "./cells/SheetCell.svelte"
  import DataCell from "./cells/DataCell.svelte"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import HeaderCell from "./cells/HeaderCell.svelte"

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
    menu,
  } = getContext("sheet")

  $: scrollLeft = $scroll.left
  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: width = 40 + ($stickyColumn?.width || 0)

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
    <SheetCell
      width="40"
      on:click={$config.allowSelectRows && selectAll}
      center
    >
      {#if $config.allowSelectRows}
        <Checkbox
          value={rowCount && selectedRowCount === rowCount}
          disabled={!$renderedRows.length}
        />
      {/if}
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
          on:mouseover={() => ($hoveredRowId = row._id)}
          on:mouseleave={() => ($hoveredRowId = null)}
        >
          <SheetCell
            rowSelected={rowSelected || containsSelectedRow}
            {rowHovered}
            width="40"
            center
          >
            <div
              on:click={() => selectRow(row._id)}
              class="checkbox"
              class:visible={$config.allowSelectRows &&
                (rowSelected || rowHovered)}
            >
              <Checkbox value={rowSelected} />
            </div>
            <div
              class="number"
              class:visible={!$config.allowSelectRows ||
                !(rowSelected || rowHovered)}
            >
              {row.__idx + 1}
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

  /* Styles for label cell */
  .checkbox,
  .number {
    padding: 0 var(--cell-padding);
  }
  .checkbox {
    display: none;
  }
  .number {
    display: none;
    color: var(--spectrum-global-color-gray-500);
  }
  .checkbox.visible,
  .number.visible {
    display: flex;
  }
</style>
