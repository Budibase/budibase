<script>
  import { getContext } from "svelte"
  import SpreadsheetCell from "./SheetCell.svelte"
  import OptionsCell from "./cells/OptionsCell.svelte"
  import DateCell from "./cells/DateCell.svelte"
  import MultiSelectCell from "./cells/MultiSelectCell.svelte"
  import NumberCell from "./cells/NumberCell.svelte"
  import RelationshipCell from "./cells/RelationshipCell.svelte"
  import TextCell from "./cells/TextCell.svelte"

  export let row

  const {
    selectedCellId,
    reorder,
    selectedRows,
    changeCache,
    spreadsheetAPI,
    visibleColumns,
    cellHeight,
  } = getContext("spreadsheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: data = { ...row, ...$changeCache[row._id] }

  const getCellForField = field => {
    const type = field.schema.type
    if (type === "options") {
      return OptionsCell
    } else if (type === "datetime") {
      return DateCell
    } else if (type === "array") {
      return MultiSelectCell
    } else if (type === "number") {
      return NumberCell
    } else if (type === "link") {
      return RelationshipCell
    }
    return TextCell
  }

  const selectRow = id => {
    selectedRows.update(state => {
      state[id] = !state[id]
      return state
    })
  }
</script>

<div class="row" style="--top:{(row.__idx + 1) * cellHeight}px;">
  <SpreadsheetCell label {rowSelected} on:click={() => selectRow(row._id)}>
    <div class="checkbox" class:visible={rowSelected}>
      <input type="checkbox" checked={rowSelected} />
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
        this={getCellForField(column)}
        value={data[column.name]}
        schema={column.schema}
        selected={$selectedCellId === cellIdx}
        onChange={val => spreadsheetAPI.updateValue(row._id, column, val)}
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
  .row:hover :global(.cell) {
    background: var(--cell-background-hover);
  }

  /* Styles for label cell */
  .checkbox {
    display: none;
  }
  input[type="checkbox"] {
    margin: 0;
  }
  .number {
    display: none;
    min-width: 14px;
    text-align: center;
    color: var(--spectrum-global-color-gray-500);
  }
  .row:hover .checkbox,
  .checkbox.visible,
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
