<script>
  import { getContext } from "svelte"
  import SpreadsheetCell from "./SpreadsheetCell.svelte"
  import OptionsCell from "./cells/OptionsCell.svelte"
  import DateCell from "./cells/DateCell.svelte"
  import MultiSelectCell from "./cells/MultiSelectCell.svelte"
  import NumberCell from "./cells/NumberCell.svelte"
  import RelationshipCell from "./cells/RelationshipCell.svelte"
  import TextCell from "./cells/TextCell.svelte"

  export let row
  export let rowIdx

  const {
    selectedCellId,
    reorder,
    hoveredRowId,
    columns,
    selectedRows,
    changeCache,
    spreadsheetAPI,
    visibleColumns,
    cellHeight,
  } = getContext("spreadsheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
  $: data = { ...row, ...$changeCache[row._id] }
  $: renderedColumns = [
    $columns[0],
    ...$columns.slice($visibleColumns[0], $visibleColumns[1]),
  ]
  $: containsSelectedCell = $selectedCellId?.split("-")[0] === row._id

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

<div
  class="row"
  style="--top:{(rowIdx + 1) * cellHeight}px;"
  class:contains-selected-cell={containsSelectedCell}
>
  <SpreadsheetCell
    label
    {rowSelected}
    {rowHovered}
    on:mouseenter={() => ($hoveredRowId = row._id)}
    on:click={() => selectRow(row._id)}
  >
    {#if rowSelected || rowHovered}
      <input type="checkbox" checked={rowSelected} />
    {:else}
      <span>
        {rowIdx + 1}
      </span>
    {/if}
  </SpreadsheetCell>
  {#each renderedColumns as column (column.name)}
    {@const cellIdx = `${row._id}-${column.name}`}
    <SpreadsheetCell
      {rowSelected}
      {rowHovered}
      sticky={column.idx === 0}
      selected={$selectedCellId === cellIdx}
      reorderSource={$reorder.columnIdx === column.idx}
      reorderTarget={$reorder.swapColumnIdx === column.idx}
      on:mouseenter={() => ($hoveredRowId = row._id)}
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
    top: 0;
    transform: translateY(var(--top));
    width: inherit;
  }
  .row.contains-selected-cell {
    z-index: 1;
  }

  .row :global(> :last-child) {
    border-right-width: 1px;
  }
</style>
