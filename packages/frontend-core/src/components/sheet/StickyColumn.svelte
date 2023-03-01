<script>
  import { getContext } from "svelte"
  import { Checkbox, Icon } from "@budibase/bbui"
  import { getIconForField } from "./utils"
  import SheetCell from "./SheetCell.svelte"
  import { getCellComponent } from "./utils"
  import SheetScrollWrapper from "./SheetScrollWrapper.svelte"

  const { rows, selectedRows, stickyColumn, visibleRows, selectedCellId } =
    getContext("spreadsheet")

  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: width = 40 + $stickyColumn?.width || 0

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
    selectedRows.update(state => ({
      ...state,
      [id]: !state[id],
    }))
  }

  const addRow = async field => {
    const newRow = await rows.actions.addRow()
    if (newRow) {
      $selectedCellId = `${newRow._id}-${field.name}`
    }
  }
</script>

<div class="sticky-column" style="--width:{width}px;">
  <div class="row">
    <!-- Field headers -->
    <SheetCell header label on:click={selectAll} width="40" left="0">
      <Checkbox value={rowCount && selectedRowCount === rowCount} />
    </SheetCell>

    {#if $stickyColumn}
      <SheetCell
        header
        sticky
        width={$stickyColumn.width}
        left={$stickyColumn.left}
      >
        <Icon
          size="S"
          name={getIconForField($stickyColumn)}
          color="var(--spectrum-global-color-gray-600)"
        />
        <span>
          {$stickyColumn.name}
        </span>
      </SheetCell>
    {/if}
  </div>

  <SheetScrollWrapper scrollHorizontally={false}>
    {#each $visibleRows as row}
      {@const rowSelected = !!$selectedRows[row._id]}
      <div class="row">
        <SheetCell
          label
          {rowSelected}
          on:click={() => selectRow(row._id)}
          width="40"
        >
          <div class="checkbox" class:visible={rowSelected}>
            <Checkbox value={rowSelected} />
          </div>
          <div class="number" class:visible={!rowSelected}>
            {row.__idx + 1}
          </div>
        </SheetCell>

        {#if $stickyColumn}
          {@const cellIdx = `${row._id}-${$stickyColumn.name}`}
          <SheetCell
            {rowSelected}
            sticky
            selected={$selectedCellId === cellIdx}
            on:click={() => ($selectedCellId = cellIdx)}
            width={$stickyColumn.width}
            left="40"
          >
            <svelte:component
              this={getCellComponent($stickyColumn)}
              value={row[$stickyColumn.name]}
              schema={$stickyColumn.schema}
              selected={$selectedCellId === cellIdx}
              onChange={val =>
                rows.actions.updateRow(row._id, $stickyColumn, val)}
              readonly={$stickyColumn.schema.autocolumn}
            />
          </SheetCell>
        {/if}
      </div>
    {/each}

    <div class="row">
      <SheetCell label on:click={addRow} width="40">
        <Icon hoverable name="Add" size="S" />
      </SheetCell>
      {#if $stickyColumn}
        <SheetCell on:click={addRow} width={$stickyColumn.width} left="40" />
      {/if}
    </div>
  </SheetScrollWrapper>
</div>

<style>
  .sticky-column {
    flex: 0 0 var(--width);
    z-index: 20;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
  }

  /* Styles for label cell */
  .checkbox {
    display: none;
  }
  .number {
    display: none;
    color: var(--spectrum-global-color-gray-500);
  }
  .row:hover .checkbox,
  .checkbox.visible {
    display: flex;
  }
  .number.visible {
    display: block;
  }
  .row:hover .number {
    display: none;
  }
</style>
