<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { getCellRenderer } from "../lib/renderers"
  import { derived, writable } from "svelte/store"

  const { rows, focusedCellId, menu, sheetAPI, config, validation } =
    getContext("sheet")

  export let rowSelected
  export let rowHovered
  export let rowFocused
  export let rowIdx
  export let focused
  export let selectedUser
  export let reorderSource
  export let reorderTarget
  export let column
  export let row
  export let cellId
  export let updateRow = rows.actions.updateRow
  export let invert = false

  const emptyError = writable(null)

  let api

  $: {
    // Wipe error if row is unfocused
    if (!rowFocused && $error) {
      validation.actions.setError(cellId, null)
    }
  }

  // Get the error for this cell if the row is focused
  $: error = getErrorStore(rowFocused, cellId)

  // Determine if the cell is editable
  $: readonly = column.schema.autocolumn || (!$config.allowEditRows && row._id)

  // Register this cell API if the row is focused
  $: {
    if (rowFocused) {
      sheetAPI.actions.registerCellAPI(cellId, cellAPI)
    }
  }

  const getErrorStore = (selected, cellId) => {
    if (!selected) {
      return emptyError
    }
    return derived(validation, $validation => $validation[cellId])
  }

  const cellAPI = {
    focus: () => api?.focus(),
    blur: () => api?.blur(),
    onKeyDown: (...params) => api?.onKeyDown(...params),
    isReadonly: () => readonly,
    isRequired: () => !!column.schema.constraints?.presence,
    validate: value => {
      // Validate the current value if no new value is provided
      if (value === undefined) {
        value = row[column.name]
      }
      let newError = null
      if (cellAPI.isReadonly() && !(value == null || value === "")) {
        // Ensure cell isn't readonly
        newError = "Auto columns can't be edited"
      } else if (cellAPI.isRequired() && (value == null || value === "")) {
        // Sanity check required fields
        newError = "Required field"
      } else {
        newError = null
      }
      validation.actions.setError(cellId, newError)
      return newError
    },
    updateValue: value => {
      cellAPI.validate(value)
      if (!$error) {
        updateRow(row._id, column.name, value)
      }
    },
  }
</script>

<SheetCell
  {rowSelected}
  {rowHovered}
  {rowFocused}
  {rowIdx}
  {focused}
  {selectedUser}
  {reorderSource}
  {reorderTarget}
  error={$error}
  on:click={() => focusedCellId.set(cellId)}
  on:contextmenu={e => menu.actions.open(cellId, e)}
  width={column.width}
>
  <svelte:component
    this={getCellRenderer(column)}
    bind:api
    value={row[column.name]}
    schema={column.schema}
    onChange={cellAPI.updateValue}
    {focused}
    {readonly}
    {invert}
  />
</SheetCell>
