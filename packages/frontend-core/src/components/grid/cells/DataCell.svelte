<script>
  import { getContext } from "svelte"
  import GridCell from "./GridCell.svelte"
  import { getCellRenderer } from "../lib/renderers"
  import { derived, writable } from "svelte/store"

  const {
    rows,
    focusedCellId,
    focusedCellAPI,
    menu,
    config,
    validation,
    selectedCells,
    selectedCellCount,
  } = getContext("grid")

  export let highlighted
  export let rowFocused
  export let rowSelected
  export let rowIdx
  export let topRow = false
  export let focused
  export let selectedUser
  export let column
  export let row
  export let cellId
  export let updateValue = rows.actions.updateValue
  export let contentLines = 1
  export let hidden = false
  export let isSelectingCells = false
  export let cellSelected = false

  const emptyError = writable(null)

  let api

  // Get the error for this cell if the cell is focused or selected
  $: error = getErrorStore(rowFocused || cellSelected, cellId)

  // Determine if the cell is editable
  $: readonly =
    column.schema.autocolumn ||
    column.schema.disabled ||
    column.schema.type === "formula" ||
    (!$config.canEditRows && !row._isNewRow) ||
    column.schema.readonly

  // Register this cell API if the row is focused
  $: {
    if (focused) {
      focusedCellAPI.set(cellAPI)
    }
  }

  // Callbacks for cell selection
  $: updateSelectionCallback = isSelectingCells ? updateSelection : null
  $: stopSelectionCallback = isSelectingCells ? stopSelection : null

  const getErrorStore = (selected, cellId) => {
    if (!selected) {
      return emptyError
    }
    return derived(validation, $validation => $validation[cellId])
  }

  const cellAPI = {
    focus: () => api?.focus?.(),
    blur: () => api?.blur?.(),
    isActive: () => api?.isActive?.() ?? false,
    onKeyDown: (...params) => api?.onKeyDown(...params),
    isReadonly: () => readonly,
    getType: () => column.schema.type,
    getValue: () => row[column.name],
    setValue: (value, options = { apply: true }) => {
      validation.actions.setError(cellId, null)
      updateValue({
        rowId: row._id,
        column: column.name,
        value,
        apply: options?.apply,
      })
    },
  }

  const startSelection = e => {
    if (e.button !== 0 || e.shiftKey) {
      return
    }
    selectedCells.actions.startSelecting(cellId)
  }

  const updateSelection = e => {
    if (e.buttons !== 1) {
      selectedCells.actions.stopSelecting()
      return
    }
    selectedCells.actions.updateTarget(cellId)
  }

  const stopSelection = () => {
    selectedCells.actions.stopSelecting()
  }

  const handleClick = e => {
    if (e.shiftKey && $focusedCellId) {
      // If we have a focused cell, select the range from that cell to here
      selectedCells.actions.selectRange($focusedCellId, cellId)
    } else if (e.shiftKey && $selectedCellCount) {
      // If we already have a selected range of cell, update it
      selectedCells.actions.updateTarget(cellId)
    } else {
      // Otherwise just select this cell
      focusedCellId.set(cellId)
    }
  }
</script>

<GridCell
  {highlighted}
  {rowIdx}
  {topRow}
  {focused}
  {selectedUser}
  {readonly}
  {hidden}
  selected={rowSelected || cellSelected}
  error={$error}
  on:contextmenu={e => menu.actions.open(cellId, e)}
  on:mousedown={startSelection}
  on:mouseenter={updateSelectionCallback}
  on:mouseup={stopSelectionCallback}
  on:click={handleClick}
  width={column.width}
>
  <svelte:component
    this={getCellRenderer(column)}
    bind:api
    value={row[column.name]}
    schema={column.schema}
    onChange={cellAPI.setValue}
    {focused}
    {readonly}
    {contentLines}
  />
  <slot />
</GridCell>
