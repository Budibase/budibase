import { writable, get, derived } from "svelte/store"
import { tick } from "svelte"
import {
  DefaultRowHeight,
  GutterWidth,
  LargeRowHeight,
  MediumRowHeight,
  NewRowID,
} from "../lib/constants"

export const createStores = context => {
  const { props } = context
  const focusedCellId = writable(null)
  const focusedCellAPI = writable(null)
  const selectedRows = writable({})
  const hoveredRowId = writable(null)
  const rowHeight = writable(get(props).fixedRowHeight || DefaultRowHeight)
  const previousFocusedRowId = writable(null)
  const gridFocused = writable(false)
  const isDragging = writable(false)

  // Derive the current focused row ID
  const focusedRowId = derived(
    focusedCellId,
    $focusedCellId => {
      return $focusedCellId?.split("-")[0]
    },
    null
  )

  // Toggles whether a certain row ID is selected or not
  const toggleSelectedRow = id => {
    selectedRows.update(state => {
      let newState = {
        ...state,
        [id]: !state[id],
      }
      if (!newState[id]) {
        delete newState[id]
      }
      return newState
    })
  }

  return {
    focusedCellId,
    focusedCellAPI,
    focusedRowId,
    previousFocusedRowId,
    hoveredRowId,
    rowHeight,
    gridFocused,
    isDragging,
    selectedRows: {
      ...selectedRows,
      actions: {
        toggleRow: toggleSelectedRow,
      },
    },
  }
}

export const deriveStores = context => {
  const { focusedCellId, rows, rowLookupMap, rowHeight, stickyColumn, width } =
    context

  // Derive the row that contains the selected cell
  const focusedRow = derived(
    [focusedCellId, rowLookupMap, rows],
    ([$focusedCellId, $rowLookupMap, $rows]) => {
      const rowId = $focusedCellId?.split("-")[0]

      // Edge case for new rows
      if (rowId === NewRowID) {
        return { _id: NewRowID }
      }

      // All normal rows
      const index = $rowLookupMap[rowId]
      return $rows[index]
    },
    null
  )

  // Derive the amount of content lines to show in cells depending on row height
  const contentLines = derived(rowHeight, $rowHeight => {
    if ($rowHeight >= LargeRowHeight) {
      return 3
    } else if ($rowHeight >= MediumRowHeight) {
      return 2
    }
    return 1
  })

  // Derive whether we should use the compact UI, depending on width
  const compact = derived([stickyColumn, width], ([$stickyColumn, $width]) => {
    return ($stickyColumn?.width || 0) + $width + GutterWidth < 1100
  })

  return {
    focusedRow,
    contentLines,
    compact,
  }
}

export const createActions = context => {
  const { focusedCellId, selectedRows, hoveredRowId } = context

  // Callback when leaving the grid, deselecting all focussed or selected items
  const blur = () => {
    focusedCellId.set(null)
    selectedRows.set({})
    hoveredRowId.set(null)
  }

  return {
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
    definition,
    rowHeight,
    fixedRowHeight,
  } = context

  // Ensure we clear invalid rows from state if they disappear
  rows.subscribe(async () => {
    // We tick here to ensure other derived stores have properly updated.
    // We depend on the row lookup map which is a derived store,
    await tick()
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

  // Remove hovered row when a cell is selected
  focusedCellId.subscribe(cell => {
    if (cell && get(hoveredRowId)) {
      hoveredRowId.set(null)
    }
  })

  // Pull row height from table as long as we don't have a fixed height
  definition.subscribe($definition => {
    if (!get(fixedRowHeight)) {
      rowHeight.set($definition?.rowHeight || DefaultRowHeight)
    }
  })

  // Reset row height when initial row height prop changes
  fixedRowHeight.subscribe(height => {
    if (height) {
      rowHeight.set(height)
    } else {
      rowHeight.set(get(definition)?.rowHeight || DefaultRowHeight)
    }
  })
}
