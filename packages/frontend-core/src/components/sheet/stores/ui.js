import { writable, get, derived } from "svelte/store"

export const createStores = () => {
  const focusedCellId = writable(null)
  const focusedCellAPI = writable(null)
  const selectedRows = writable({})
  const hoveredRowId = writable(null)
  const rowHeight = writable(36)
  const previousFocusedRowId = writable(null)

  // Derive the current focused row ID
  const focusedRowId = derived(
    focusedCellId,
    $focusedCellId => {
      return $focusedCellId?.split("-")[0]
    },
    null
  )

  return {
    focusedCellId,
    focusedCellAPI,
    focusedRowId,
    previousFocusedRowId,
    selectedRows,
    hoveredRowId,
    rowHeight,
  }
}

export const deriveStores = context => {
  const {
    focusedCellId,
    selectedRows,
    hoveredRowId,
    enrichedRows,
    rowLookupMap,
  } = context

  // Derive the row that contains the selected cell
  const focusedRow = derived(
    [focusedCellId, rowLookupMap, enrichedRows],
    ([$focusedCellId, $rowLookupMap, $enrichedRows]) => {
      const rowId = $focusedCellId?.split("-")[0]

      if (rowId === "new") {
        // Edge case for new row
        return { _id: rowId }
      } else {
        // All normal rows
        const index = $rowLookupMap[rowId]
        return $enrichedRows[index]
      }
    },
    null
  )

  // Callback when leaving the sheet, deselecting all focussed or selected items
  const blur = () => {
    focusedCellId.set(null)
    selectedRows.set({})
    hoveredRowId.set(null)
  }

  return {
    focusedRow,
    ui: {
      actions: {
        blur,
      },
    },
  }
}

export const initialise = context => {
  const {
    focusedRowId,
    previousFocusedRowId,
    rows,
    focusedCellId,
    selectedRows,
    hoveredRowId,
  } = context

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

  // Remember the last focused row ID so that we can store the previous one
  let lastFocusedRowId = null
  focusedRowId.subscribe(id => {
    previousFocusedRowId.set(lastFocusedRowId)
    lastFocusedRowId = id
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

  // Remove hovered row when a cell is selected
  focusedCellId.subscribe(cell => {
    if (cell && get(hoveredRowId)) {
      hoveredRowId.set(null)
    }
  })
}
