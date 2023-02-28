<svelte:options immutable={true} />

<script>
  import { getContext } from "svelte"
  import SpreadsheetCell from "./SheetCell.svelte"
  import OptionsCell from "./cells/OptionsCell.svelte"
  import DateCell from "./cells/DateCell.svelte"
  import MultiSelectCell from "./cells/MultiSelectCell.svelte"
  import NumberCell from "./cells/NumberCell.svelte"
  import RelationshipCell from "./cells/RelationshipCell.svelte"
  import TextCell from "./cells/TextCell.svelte"
  import { Checkbox } from "@budibase/bbui"

  export let row

  const {
    selectedCellId,
    reorder,
    selectedRows,
    rows,
    visibleColumns,
    cellHeight,
  } = getContext("spreadsheet")
  const TypeComponentMap = {
    options: OptionsCell,
    datetime: DateCell,
    array: MultiSelectCell,
    number: NumberCell,
    link: RelationshipCell,
  }

  $: rowSelected = !!$selectedRows[row._id]

  const selectRow = id => {
    selectedRows.update(state => ({
      ...state,
      [id]: !state[id],
    }))
  }
</script>

<div class="row" style="--top:{(row.__idx + 1) * cellHeight}px;">
  <SpreadsheetCell label {rowSelected} on:click={() => selectRow(row._id)}>
    <div class="checkbox" class:visible={rowSelected}>
      <Checkbox value={rowSelected} />
    </div>
    <div class="number" class:visible={!rowSelected}>
      {row.__idx + 1}
    </div>
  </SpreadsheetCell>
  {#each $visibleColumns as column (column.name)}
    {@const cellIdx = `${row._id}-${column.name}`}
    <SpreadsheetCell
      {rowSelected}
      sticky={column.idx === 0}
      selected={$selectedCellId === cellIdx}
      reorderSource={$reorder.columnIdx === column.idx}
      reorderTarget={$reorder.swapColumnIdx === column.idx}
      on:click={() => ($selectedCellId = cellIdx)}
      width={column.width}
      left={column.left}
      column={column.idx}
    >
      <svelte:component
        this={TypeComponentMap[column.schema.type] || TextCell}
        value={row[column.name]}
        schema={column.schema}
        selected={$selectedCellId === cellIdx}
        onChange={val => rows.actions.updateRow(row._id, column, val)}
        readonly={column.schema.autocolumn}
      />
    </SpreadsheetCell>
  {/each}
</div>

<style>
  .row {
    display: flex;
    position: absolute;
    top: var(--top);
    width: inherit;
  }
  :global(.sheet:not(.is-resizing):not(.is-reordering) .row:hover .cell) {
    background: var(--cell-background-hover);
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

  /* Add right border to last cell */
  .row :global(> :last-child) {
    border-right-width: 1px;
  }
</style>
