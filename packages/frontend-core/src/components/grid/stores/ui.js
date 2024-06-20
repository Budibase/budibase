import { writable, get, derived } from "svelte/store"
import { tick } from "svelte"
import {
  DefaultRowHeight,
  GutterWidth,
  LargeRowHeight,
  MediumRowHeight,
  NewRowID,
} from "../lib/constants"
import { parseCellID } from "../lib/utils"

export const createStores = context => {
  const { props } = context
  const focusedCellId = writable(null)
  const focusedCellAPI = writable(null)
  const selectedRows = writable({})
  const hoveredRowId = writable(null)
  const rowHeight = writable(get(props).fixedRowHeight || DefaultRowHeight)
  const previousFocusedRowId = writable(null)
  const previousFocusedCellId = writable(null)
  const gridFocused = writable(false)
  const keyboardBlocked = writable(false)
  const isDragging = writable(false)
  const buttonColumnWidth = writable(0)

  return {
    focusedCellId,
    focusedCellAPI,
    previousFocusedRowId,
    previousFocusedCellId,
    hoveredRowId,
    rowHeight,
    gridFocused,
    keyboardBlocked,
    isDragging,
    buttonColumnWidth,
    selectedRows,
  }
}

export const deriveStores = context => {
  const {
    focusedCellId,
    rows,
    rowLookupMap,
    rowHeight,
    stickyColumn,
    width,
    selectedRows,
  } = context

  // Derive the current focused row ID
  const focusedRowId = derived(focusedCellId, $focusedCellId => {
    return parseCellID($focusedCellId)?.id
  })

  // Derive the row that contains the selected cell
  const focusedRow = derived(
    [focusedRowId, rowLookupMap, rows],
    ([$focusedRowId, $rowLookupMap, $rows]) => {
      // Edge case for new rows
      if ($focusedRowId === NewRowID) {
        return { _id: NewRowID }
      }

      // All normal rows
      const index = $rowLookupMap[$focusedRowId]
      return $rows[index]
    }
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
    return ($stickyColumn?.width || 0) + $width + GutterWidth < 800
  })

  // Derive we have any selected rows or not
  const selectedRowCount = derived(selectedRows, $selectedRows => {
    return Object.keys($selectedRows).length
  })

  return {
    focusedRowId,
    focusedRow,
    contentLines,
    compact,
    selectedRowCount,
  }
}

export const createActions = context => {
  const {
    focusedCellId,
    hoveredRowId,
    selectedRows,
    rowLookupMap,
    rows,
    selectedRowCount,
  } = context
  // Keep the last selected index to use with bulk selection
  let lastSelectedIndex = null

  // Callback when leaving the grid, deselecting all focussed or selected items
  const blur = () => {
    focusedCellId.set(null)
    hoveredRowId.set(null)
  }

  // Toggles whether a certain row ID is selected or not
  const toggleSelectedRow = id => {
    selectedRows.update(state => {
      let newState = {
        ...state,
        [id]: !state[id],
      }
      if (!newState[id]) {
        delete newState[id]
      } else {
        lastSelectedIndex = get(rowLookupMap)[id]
      }
      return newState
    })
  }

  const bulkSelectRows = id => {
    if (!get(selectedRowCount)) {
      toggleSelectedRow(id)
      return
    }
    // There should always be a last selected index
    if (lastSelectedIndex == null) {
      throw "NO LAST SELECTED INDEX"
    }
    const thisIndex = get(rowLookupMap)[id]

    // Skip if indices are the same
    if (lastSelectedIndex === thisIndex) {
      return
    }

    const from = Math.min(lastSelectedIndex, thisIndex)
    const to = Math.max(lastSelectedIndex, thisIndex)
    const $rows = get(rows)
    selectedRows.update(state => {
      for (let i = from; i <= to; i++) {
        state[$rows[i]._id] = true
      }
      return state
    })
  }

  return {
    ui: {
      actions: {
        blur,
      },
    },
    selectedRows: {
      ...selectedRows,
      actions: {
        toggleRow: toggleSelectedRow,
        bulkSelectRows,
      },
    },
  }
}

export const initialise = context => {
  const {
    focusedRowId,
    previousFocusedRowId,
    previousFocusedCellId,
    rows,
    focusedCellId,
    selectedRows,
    hoveredRowId,
    definition,
    rowHeight,
    fixedRowHeight,
    selectedRowCount,
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
    const selectedRowId = parseCellID($focusedCellId)?.id
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

  let lastFocusedCellId = null
  focusedCellId.subscribe(id => {
    // Remember the last focused cell ID so that we can store the previous one
    previousFocusedCellId.set(lastFocusedCellId)
    lastFocusedCellId = id

    // Remove hovered row when a cell is selected
    if (id && get(hoveredRowId)) {
      hoveredRowId.set(null)
    }

    // Clear row selection when focusing a cell
    if (id && get(selectedRowCount)) {
      selectedRows.set({})
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

  // Clear focused cell when selecting rows
  selectedRowCount.subscribe(count => {
    if (get(focusedCellId) && count) {
      focusedCellId.set(null)
    }
  })
}
