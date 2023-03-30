import { writable, get, derived } from "svelte/store"

export const createUIStores = context => {
  const { rows, rowLookupMap } = context
  const selectedCellId = writable(null)
  const selectedRows = writable({})
  const hoveredRowId = writable(null)
  const selectedCellAPI = writable(null)

  // Derive the row that contains the selected cell.
  const selectedCellRow = derived(
    [selectedCellId, rowLookupMap, rows],
    ([$selectedCellId, $rowLookupMap, $rows]) => {
      const rowId = $selectedCellId?.split("-")[0]
      const index = $rowLookupMap[rowId]
      return $rows[index]
    },
    null
  )

  // Ensure we clear invalid rows from state if they disappear
  rows.subscribe(() => {
    const $selectedCellId = get(selectedCellId)
    const $selectedRows = get(selectedRows)
    const $hoveredRowId = get(hoveredRowId)
    const hasRow = rows.actions.hasRow

    // Check selected cell
    const selectedRowId = $selectedCellId?.split("-")[0]
    if (selectedRowId && !hasRow(selectedRowId)) {
      selectedCellId.set(null)
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
  selectedCellId.subscribe(id => {
    if (id) {
      selectedRows.set({})
    }
  })

  // Unset selected cell when rows are selected
  selectedRows.subscribe(rows => {
    if (Object.keys(rows || {}).length) {
      selectedCellId.set(null)
    }
  })

  // Callback when leaving the sheet, deselecting all focussed or selected items
  const blur = () => {
    selectedCellId.set(null)
    selectedRows.set({})
    hoveredRowId.set(null)
  }

  // Remove selected cell API when no selected cell is present
  selectedCellId.subscribe(cell => {
    if (!cell && get(selectedCellAPI)) {
      selectedCellAPI.set(null)
    }
  })

  // Remove hovered row when a cell is selected
  selectedCellId.subscribe(cell => {
    if (cell && get(hoveredRowId)) {
      hoveredRowId.set(null)
    }
  })

  return {
    selectedCellId,
    selectedRows,
    hoveredRowId,
    selectedCellRow,
    selectedCellAPI,
    ui: {
      actions: {
        blur,
      },
    },
  }
}
