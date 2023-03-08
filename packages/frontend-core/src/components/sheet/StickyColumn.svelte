<script>
  import { getContext } from "svelte"
  import { Checkbox, Icon } from "@budibase/bbui"
  import SheetCell from "./cells/SheetCell.svelte"
  import { getCellRenderer } from "./renderers"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"
  import HeaderCell from "./cells/HeaderCell.svelte"

  const {
    rows,
    selectedRows,
    stickyColumn,
    visibleRows,
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

  const addRow = async field => {
    const newRow = await rows.actions.addRow()
    if (newRow) {
      $selectedCellId = `${newRow._id}-${field.name}`
    }
  }
</script>

<div
  class="sticky-column"
  style="--width:{width}px;"
  class:scrolled={scrollLeft > 0}
>
  <div class="header row">
    <!-- Field headers -->
    <SheetCell
      header
      foo
      label
      width="40"
      on:click={$config.allowSelectRows && selectAll}
    >
      {#if $config.allowSelectRows}
        <Checkbox value={rowCount && selectedRowCount === rowCount} />
      {/if}
    </SheetCell>

    {#if $stickyColumn}
      <HeaderCell column={$stickyColumn} orderable={false} />
    {/if}
  </div>

  <div class="content" on:mouseleave={() => ($hoveredRowId = null)}>
    <SheetScrollWrapper scrollHorizontally={false}>
      {#each $visibleRows as row, idx}
        {@const rowSelected = !!$selectedRows[row._id]}
        {@const rowHovered = $hoveredRowId === row._id}
        {@const containsSelectedRow = $selectedCellRow?._id === row._id}
        <div class="row" on:mouseenter={() => ($hoveredRowId = row._id)}>
          <SheetCell
            label
            rowSelected={rowSelected || containsSelectedRow}
            {rowHovered}
            width="40"
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
            <SheetCell
              rowSelected={rowSelected || containsSelectedRow}
              {rowHovered}
              rowIdx={idx}
              sticky
              selected={$selectedCellId === cellId}
              selectedUser={$selectedCellMap[cellId]}
              on:click={() => ($selectedCellId = cellId)}
              on:contextmenu={e => menu.actions.open(cellId, e)}
              width={$stickyColumn.width}
              reorderTarget={$reorder.targetColumn === $stickyColumn.name}
            >
              <svelte:component
                this={getCellRenderer($stickyColumn)}
                value={row[$stickyColumn.name]}
                schema={$stickyColumn.schema}
                selected={$selectedCellId === cellId}
                onChange={val =>
                  rows.actions.updateRow(row._id, $stickyColumn, val)}
                readonly={$stickyColumn.schema.autocolumn}
              />
            </SheetCell>
          {/if}
        </div>
      {/each}

      {#if $config.allowAddRows}
        <div
          class="row new"
          on:focus
          on:mouseover={() => ($hoveredRowId = "new")}
        >
          <SheetCell
            rowHovered={$hoveredRowId === "new"}
            label
            on:click={addRow}
            width="40"
          >
            <Icon name="Add" size="S" />
          </SheetCell>
          {#if $stickyColumn}
            <SheetCell
              on:click={addRow}
              width={$stickyColumn.width}
              rowHovered={$hoveredRowId === "new"}
              reorderTarget={$reorder.targetColumn === $stickyColumn.name}
            />
          {/if}
        </div>
      {/if}
    </SheetScrollWrapper>
  </div>
</div>

<style>
  .sticky-column {
    flex: 0 0 calc(var(--width) + 0px);
  }
  .sticky-column.scrolled :global(.cell:last-child:after) {
    content: " ";
    position: absolute;
    width: 10px;
    height: 100%;
    left: 100%;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
  }
  .sticky-column :global(.cell:not(:last-child)) {
    border-right: none;
  }

  .header {
    border-bottom: var(--cell-border);
    position: relative;
    z-index: 2;
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
  }
  .row.new:hover :global(.cell) {
    cursor: pointer;
  }

  /* Styles for label cell */
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
