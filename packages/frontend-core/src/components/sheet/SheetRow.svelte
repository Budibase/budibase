<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { getCellRenderer } from "./renderers"

  export let row

  const {
    selectedCellId,
    reorder,
    selectedRows,
    rows,
    visibleColumns,
    hoveredRowId,
  } = getContext("spreadsheet")

  $: rowSelected = !!$selectedRows[row._id]
  $: rowHovered = $hoveredRowId === row._id
</script>

<div
  class="row"
  on:mouseover={() => ($hoveredRowId = row._id)}
  on:mouseleave={() => ($hoveredRowId = null)}
>
  {#each $visibleColumns as column (column.name)}
    {@const cellIdx = `${row._id}-${column.name}`}
    <SheetCell
      {rowSelected}
      {rowHovered}
      selected={$selectedCellId === cellIdx}
      reorderSource={$reorder.sourceColumn === column.name}
      reorderTarget={$reorder.targetColumn === column.name}
      on:click={() => ($selectedCellId = cellIdx)}
      width={column.width}
    >
      <svelte:component
        this={getCellRenderer(column)}
        value={row[column.name]}
        schema={column.schema}
        selected={$selectedCellId === cellIdx}
        onChange={val => rows.actions.updateRow(row._id, column, val)}
        readonly={column.schema.autocolumn}
      />
    </SheetCell>
  {/each}
</div>

<style>
  .row {
    width: 0;
    display: flex;
  }
</style>
