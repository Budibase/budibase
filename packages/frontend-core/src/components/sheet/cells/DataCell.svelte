<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { getCellRenderer } from "../lib/renderers"

  const { rows, selectedCellId, menu, selectedCellAPI } = getContext("sheet")

  export let rowSelected
  export let rowHovered
  export let rowIdx
  export let selected
  export let selectedUser
  export let reorderSource
  export let reorderTarget
  export let column
  export let row
  export let cellId
  export let updateRow = rows.actions.updateRow
  export let showPlaceholder = false
  export let invert = false

  let api
  let error

  // Build cell API
  $: cellAPI = {
    ...api,
    isReadonly: () => !!column.schema.autocolumn,
    isRequired: () => !!column.schema.constraints?.presence,
    updateValue: value => {
      error = null
      try {
        if (cellAPI.isReadonly()) {
          // Ensure cell isn't readonly
          error = "Auto columns can't be edited"
        } else if (cellAPI.isRequired() && (value == null || value === "")) {
          // Sanity check required fields
          error = "Required field"
        } else {
          updateRow(row._id, column.name, value)
        }
      } catch (err) {
        error = err
      }
    },
  }

  // Update selected cell API if selected
  $: {
    if (selected) {
      selectedCellAPI.set(cellAPI)
    } else {
      error = null
    }
  }
</script>

<SheetCell
  {rowSelected}
  {rowHovered}
  {rowIdx}
  {selected}
  {selectedUser}
  {reorderSource}
  {reorderTarget}
  {error}
  on:click={() => selectedCellId.set(cellId)}
  on:contextmenu={e => menu.actions.open(cellId, e)}
  width={column.width}
>
  {#if !selected && showPlaceholder && (row[column.name] == null || row[column.name] === "")}
    <div class="placeholder">
      {column.name}
    </div>
  {:else}
    <svelte:component
      this={getCellRenderer(column)}
      bind:api
      value={row[column.name]}
      schema={column.schema}
      {selected}
      onChange={cellAPI.updateValue}
      readonly={column.schema.autocolumn}
      {invert}
    />
  {/if}
</SheetCell>

<style>
  .placeholder {
    font-style: italic;
    padding: var(--cell-padding);
  }
</style>
