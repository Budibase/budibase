import { writable, get, derived } from "svelte/store"
import { tick } from "svelte"
import {
  DefaultRowHeight,
  GutterWidth,
  LargeRowHeight,
  MediumRowHeight,
  NewRowID,
} from "../lib/constants"
import { getCellID, parseCellID } from "../lib/utils"

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
  const cellSelection = writable({
    active: false,
    sourceCellId: null,
    targetCellId: null,
  })

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
    cellSelection,
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
    cellSelection,
    columnLookupMap,
    allVisibleColumns,
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

  // Derive whether or not we're actively selecting cells
  const isSelectingCells = derived(cellSelection, $cellSelection => {
    return $cellSelection.active
  })

  // Derive the full extent of all selected cells
  const selectedCells = derived(
    [cellSelection, rowLookupMap, columnLookupMap],
    ([$cellSelection, $rowLookupMap, $columnLookupMap]) => {
      const { sourceCellId, targetCellId } = $cellSelection
      if (!sourceCellId || !targetCellId || sourceCellId === targetCellId) {
        return {}
      }
      const $rows = get(rows)
      const $allVisibleColumns = get(allVisibleColumns)

      // Get source and target row and column indices
      const sourceInfo = parseCellID(sourceCellId)
      const targetInfo = parseCellID(targetCellId)

      // Row indices
      const sourceRowIndex = $rowLookupMap[sourceInfo.id]
      const targetRowIndex = $rowLookupMap[targetInfo.id]
      const lowerRowIndex = Math.min(sourceRowIndex, targetRowIndex)
      const upperRowIndex = Math.max(sourceRowIndex, targetRowIndex)

      // Column indices
      const sourceColIndex = $columnLookupMap[sourceInfo.field]
      const targetColIndex = $columnLookupMap[targetInfo.field]
      const lowerColIndex = Math.min(sourceColIndex, targetColIndex)
      const upperColIndex = Math.max(sourceColIndex, targetColIndex)

      // Build map of all cells inside these bounds
      let map = {}
      let rowId, colName, cellId
      for (let rowIdx = lowerRowIndex; rowIdx <= upperRowIndex; rowIdx++) {
        for (let colIdx = lowerColIndex; colIdx <= upperColIndex; colIdx++) {
          rowId = $rows[rowIdx]._id
          colName = $allVisibleColumns[colIdx].name
          cellId = getCellID(rowId, colName)
          map[cellId] = { rowIdx, colIdx }
        }
      }
      return map
    }
  )

  // Derive the count of the selected cells
  const selectedCellCount = derived(selectedCells, $selectedCells => {
    return Object.keys($selectedCells).length
  })

  return {
    focusedRowId,
    focusedRow,
    contentLines,
    compact,
    selectedRowCount,
    isSelectingCells,
    selectedCells,
    selectedCellCount,
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
    cellSelection,
    selectedCells,
  } = context
  // Keep the last selected index to use with bulk selection
  let lastSelectedIndex = null

  // Callback when leaving the grid, deselecting all focussed or selected items
  const blur = () => {
    focusedCellId.set(null)
    hoveredRowId.set(null)
    clearCellSelection()
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

  const startCellSelection = sourceCellId => {
    cellSelection.set({
      active: true,
      sourceCellId,
      targetCellId: sourceCellId,
    })
  }

  const updateCellSelection = targetCellId => {
    cellSelection.update(state => ({
      ...state,
      targetCellId,
    }))
  }

  const stopCellSelection = () => {
    cellSelection.update(state => ({
      ...state,
      active: false,
    }))
  }

  const clearCellSelection = () => {
    cellSelection.set({
      active: false,
      sourceCellId: null,
      targetCellId: null,
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
    selectedCells: {
      ...selectedCells,
      actions: {
        start: startCellSelection,
        update: updateCellSelection,
        stop: stopCellSelection,
        clear: clearCellSelection,
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
    menu,
    selectedCellCount,
    selectedCells,
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

    // Clear cell selection when focusing a cell
    if (id && get(selectedCellCount)) {
      selectedCells.actions.clear()
    }

    // Close the menu if it was open
    menu.actions.close()
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
    if (count) {
      if (get(focusedCellId)) {
        focusedCellId.set(null)
      }
      if (get(selectedCellCount)) {
        selectedCells.actions.clear()
      }
    }
  })

  // Clear selected rows when selecting cells
  selectedCellCount.subscribe($selectedCellCount => {
    if ($selectedCellCount && get(selectedRowCount)) {
      selectedRows.set({})
    }
  })
}
