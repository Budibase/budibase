<script>
  import SheetCell from "./SheetCell.svelte"
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"

  const { visibleColumns, reorder, selectedRows, rows } =
    getContext("spreadsheet")

  $: rowCount = $rows.length
  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length

  const getIconForField = field => {
    const type = field.schema.type
    if (type === "options") {
      return "ChevronDown"
    } else if (type === "datetime") {
      return "Date"
    }
    return "Text"
  }

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
</script>

<div class="row">
  <!-- Field headers -->
  <SheetCell header label on:click={selectAll} width="40" left="0">
    <input
      type="checkbox"
      checked={rowCount && selectedRowCount === rowCount}
    />
  </SheetCell>
  {#each $visibleColumns as column}
    <SheetCell
      header
      sticky={column.idx === 0}
      reorderSource={$reorder.columnIdx === column.idx}
      reorderTarget={$reorder.swapColumnIdx === column.idx}
      on:mousedown={column.idx === 0
        ? null
        : e => reorder.actions.startReordering(column.idx, e)}
      width={column.width}
      left={column.left}
    >
      <Icon
        size="S"
        name={getIconForField(column)}
        color="var(--spectrum-global-color-gray-600)"
      />
      <span>
        {column.name}
      </span>
    </SheetCell>
  {/each}
</div>

<style>
  .row {
    display: flex;
    position: sticky;
    top: 0;
    width: inherit;
    z-index: 10;
  }
  .row.new {
    position: absolute;
    transform: translateY(var(--top));
  }
  .row :global(> :last-child) {
    border-right-width: 1px;
  }
  input[type="checkbox"] {
    margin: 0;
  }
</style>
