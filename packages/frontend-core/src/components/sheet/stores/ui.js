import { writable, get, derived } from "svelte/store"

export const createUIStores = context => {
  const { rows, rowLookupMap } = context
  const focusedCellId = writable(null)
  const selectedRows = writable({})
  const hoveredRowId = writable(null)
  const rowHeight = writable(36)

  // Derive the row that contains the selected cell
  const focusedRow = derived(
    [focusedCellId, rowLookupMap, rows],
    ([$focusedCellId, $rowLookupMap, $rows]) => {
      const rowId = $focusedCellId?.split("-")[0]
      const index = $rowLookupMap[rowId]
      return $rows[index]
    },
    null
  )

  // Ensure we clear invalid rows from state if they disappear
  rows.subscribe(() => {
    const $focusedCellId = get(focusedCellId)
    const $selectedRows = get(selectedRows)
    const $hoveredRowId = get(hoveredRowId)
    const hasRow = rows.actions.hasRow

    // Check selected cell
    const selectedRowId = $focusedCellId?.split("-")[0]
    if (selectedRowId && !hasRow(selectedRowId)) {
      focusedCellId.set(null)
    }

    // Check hovered row
    if ($hoveredRowId && !hasRow($hoveredRowId)) {
      hoveredRowId.set(null)
    }

    // Check selected rows
    let newSelectedRows = { ...$selectedRows }
    let selectedRowsNeedsUpdate = false
    const selectedIds = Object.keys($selectedRows)
    for (let i = 0; i < selectedIds.length; i++) {
      if (!hasRow(selectedIds[i])) {
        delete newSelectedRows[selectedIds[i]]
        selectedRowsNeedsUpdate = true
      }
    }
    if (selectedRowsNeedsUpdate) {
      selectedRows.set(newSelectedRows)
    }
  })

  // Reset selected rows when selected cell changes
  focusedCellId.subscribe(id => {
    if (id) {
      selectedRows.set({})
    }
  })

  // Unset selected cell when rows are selected
  selectedRows.subscribe(rows => {
    if (Object.keys(rows || {}).length) {
      focusedCellId.set(null)
    }
  })

  // Callback when leaving the sheet, deselecting all focussed or selected items
  const blur = () => {
    focusedCellId.set(null)
    selectedRows.set({})
    hoveredRowId.set(null)
  }

  // Remove hovered row when a cell is selected
  focusedCellId.subscribe(cell => {
    if (cell && get(hoveredRowId)) {
      hoveredRowId.set(null)
    }
  })

  return {
    focusedCellId,
    selectedRows,
    hoveredRowId,
    focusedRow,
    rowHeight,
    ui: {
      actions: {
        blur,
      },
    },
  }
}
