<script>
  import { getContext, onMount } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { getCellRenderer } from "../lib/renderers"

  const { rows, selectedCellId, menu, selectedCellAPI, config } =
    getContext("sheet")

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
  export let invert = false

  let api
  let error

  const cellAPI = {
    focus: () => api?.focus(),
    blur: () => api?.blur(),
    onKeyDown: (...params) => api?.onKeyDown(...params),
    isReadonly: () => readonly,
    isRequired: () => !!column.schema.constraints?.presence,
    validate: value => {
      if (value === undefined) {
        value = row[column.name]
      }
      if (cellAPI.isReadonly() && !(value == null || value === "")) {
        // Ensure cell isn't readonly
        error = "Auto columns can't be edited"
      } else if (cellAPI.isRequired() && (value == null || value === "")) {
        // Sanity check required fields
        error = "Required field"
      } else {
        error = null
      }
      return error
    },
    updateValue: value => {
      try {
        cellAPI.validate(value)
        if (!error) {
          updateRow(row._id, column.name, value)
        }
      } catch (err) {
        error = err
      }
    },
  }

  // Determine if the cell is editable
  $: readonly = column.schema.autocolumn || (!$config.allowEditRows && row._id)

  // Update selected cell API if selected
  $: {
    if (selected) {
      selectedCellAPI.set(cellAPI)
    } else if (error) {
      // error = null
    }
  }
</script>

{#key error}
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
    <svelte:component
      this={getCellRenderer(column)}
      bind:api
      value={row[column.name]}
      schema={column.schema}
      {selected}
      onChange={cellAPI.updateValue}
      {readonly}
      {invert}
      placeholder="error"
    />
  </SheetCell>
{/key}

<style>
  .placeholder {
    font-style: italic;
    padding: var(--cell-padding);
  }
</style>
