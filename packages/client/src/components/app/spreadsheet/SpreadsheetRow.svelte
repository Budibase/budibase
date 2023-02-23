<script>
  import { getContext } from "svelte"
  import SpreadsheetCell from "./SpreadsheetCell.svelte"
  import SpacerCell from "./SpacerCell.svelte"
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
    visibleRows,
  } = getContext("spreadsheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
  $: data = { ...row, ...$changeCache[row._id] }
  $: visible = rowIdx >= $visibleRows[0] && rowIdx <= $visibleRows[1]

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

{#if !visible}
  <div class="row-placeholder" />
{:else}
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
  {#each $columns as field, fieldIdx}
    {@const cellIdx = `${row._id}-${field.name}`}
    {#key cellIdx}
      <SpreadsheetCell
        {rowSelected}
        {rowHovered}
        sticky={fieldIdx === 0}
        selected={$selectedCellId === cellIdx}
        reorderSource={$reorder.columnIdx === fieldIdx}
        reorderTarget={$reorder.swapColumnIdx === fieldIdx}
        on:mouseenter={() => ($hoveredRowId = row._id)}
        on:click={() => ($selectedCellId = cellIdx)}
      >
        <svelte:component
          this={getCellForField(field)}
          value={data[field.name]}
          schema={field.schema}
          selected={$selectedCellId === cellIdx}
          onChange={val => spreadsheetAPI.updateValue(row._id, field, val)}
          readonly={field.schema.autocolumn}
        />
      </SpreadsheetCell>
    {/key}
  {/each}
  <SpacerCell reorderTarget={$reorder.swapColumnIdx === $columns.length} />
{/if}

<style>
  .row-placeholder {
    height: var(--cell-height);
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--cell-background);
    grid-column: 1/-1;
  }
</style>
