import { writable, get, derived, Writable, Readable } from "svelte/store"
import { tick } from "svelte"
import {
  DefaultRowHeight,
  LargeRowHeight,
  MediumRowHeight,
  NewRowID,
} from "../lib/constants"
import { getCellID, parseCellID } from "../lib/utils"
import { Store as StoreContext } from "."
import { Row } from "@budibase/types"

export interface UIStore {
  focusedCellId: Writable<string | null>
  focusedCellAPI: Writable<{
    isReadonly: () => boolean
    getValue: () => any
    setValue: (val: any) => void
  } | null>
  selectedRows: Writable<Record<string, boolean>>
  hoveredRowId: Writable<string | null>
  rowHeight: Writable<number>
  previousFocusedRowId: Writable<string | null>
  previousFocusedCellId: Writable<string | null>
  gridFocused: Writable<boolean>
  keyboardBlocked: Writable<boolean>
  isDragging: Writable<boolean>
  buttonColumnWidth: Writable<number>
  cellSelection: Writable<{
    active: boolean
    sourceCellId: string | null
    targetCellId: string | null
  }>
}

export interface UIDerivedStore {
  focusedRowId: Readable<string | null>
  focusedRow: Readable<Row | undefined>
  contentLines: Readable<3 | 2 | 1>
  compact: Readable<boolean>
  selectedRowCount: Readable<number>
  isSelectingCells: Readable<boolean>
  selectedCells: Readable<string[][]>
  selectedCellMap: Readable<Record<string, boolean>>
  selectedCellCount: Readable<number>
}

interface UIActionStore {
  selectedCells: UIDerivedStore["selectedCells"] & {
    actions: {
      clear: () => void
      selectRange: (source: string | null, target: string | null) => void
    }
  }
  ui: {
    actions: {
      blur: () => void
    }
  }
}

export type Store = UIStore & UIDerivedStore & UIActionStore

export const createStores = (context: StoreContext): UIStore => {
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

export const deriveStores = (context: StoreContext): UIDerivedStore => {
  const {
    focusedCellId,
    rows,
    rowLookupMap,
    rowHeight,
    width,
    selectedRows,
    cellSelection,
    columnLookupMap,
    visibleColumns,
  } = context

  // Derive the current focused row ID
  const focusedRowId = derived(focusedCellId, $focusedCellId => {
    return parseCellID($focusedCellId).rowId ?? null
  })

  // Derive the row that contains the selected cell
  const focusedRow = derived(
    [focusedRowId, rowLookupMap],
    ([$focusedRowId, $rowLookupMap]) => {
      if ($focusedRowId === null) {
        return
      }

      if ($focusedRowId === NewRowID) {
        return { _id: NewRowID }
      }
      return $rowLookupMap[$focusedRowId]
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
  const compact = derived(width, $width => {
    return $width < 600
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
        return []
      }
      const $rows = get(rows)
      const $visibleColumns = get(visibleColumns)

      // Get source and target row and column indices
      const sourceInfo = parseCellID(sourceCellId)
      const targetInfo = parseCellID(targetCellId)
      if (sourceInfo.rowId === NewRowID) {
        return []
      }

      // Row indices
      const sourceRowIndex = $rowLookupMap[sourceInfo.rowId!]?.__idx
      const targetRowIndex = $rowLookupMap[targetInfo.rowId!]?.__idx
      if (sourceRowIndex == null || targetRowIndex == null) {
        return []
      }
      const lowerRowIndex = Math.min(sourceRowIndex, targetRowIndex)
      let upperRowIndex = Math.max(sourceRowIndex, targetRowIndex)

      // Cap rows at 50
      upperRowIndex = Math.min(upperRowIndex, lowerRowIndex + 49)

      // Column indices
      const sourceColIndex = $columnLookupMap[sourceInfo.field!].__idx || 0
      const targetColIndex = $columnLookupMap[targetInfo.field!].__idx || 0
      const lowerColIndex = Math.min(sourceColIndex, targetColIndex)
      const upperColIndex = Math.max(sourceColIndex, targetColIndex)

      // Build 2 dimensional array of all cells inside these bounds
      let cells = []
      let rowId, colName
      for (let rowIdx = lowerRowIndex; rowIdx <= upperRowIndex; rowIdx++) {
        let rowCells = []
        for (let colIdx = lowerColIndex; colIdx <= upperColIndex; colIdx++) {
          rowId = $rows[rowIdx]._id
          colName = $visibleColumns[colIdx].name
          rowCells.push(getCellID(rowId, colName))
        }
        cells.push(rowCells)
      }
      return cells
    }
  )

  // Derive a quick lookup map of the selected cells
  const selectedCellMap = derived(selectedCells, $selectedCells => {
    let map: Record<string, boolean> = {}
    for (let row of $selectedCells) {
      for (let cell of row) {
        map[cell] = true
      }
    }
    return map
  })

  // Derive the count of the selected cells
  const selectedCellCount = derived(selectedCellMap, $selectedCellMap => {
    return Object.keys($selectedCellMap).length
  })

  return {
    focusedRowId,
    focusedRow,
    contentLines,
    compact,
    selectedRowCount,
    isSelectingCells,
    selectedCells,
    selectedCellMap,
    selectedCellCount,
  }
}

export const createActions = (context: StoreContext) => {
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
  let lastSelectedIndex: number | null = null

  // Callback when leaving the grid, deselecting all focussed or selected items
  const blur = () => {
    focusedCellId.set(null)
    hoveredRowId.set(null)
    clearCellSelection()
  }

  // Toggles whether a certain row ID is selected or not
  const toggleSelectedRow = (id: string) => {
    selectedRows.update(state => {
      let newState = {
        ...state,
        [id]: !state[id],
      }
      if (!newState[id]) {
        delete newState[id]
      } else {
        lastSelectedIndex = get(rowLookupMap)[id].__idx
      }
      return newState
    })
  }

  const bulkSelectRows = (id: string) => {
    if (!get(selectedRowCount)) {
      toggleSelectedRow(id)
      return
    }
    if (lastSelectedIndex == null) {
      return
    }
    const thisIndex = get(rowLookupMap)[id].__idx

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

  const startCellSelection = (sourceCellId: string) => {
    cellSelection.set({
      active: true,
      sourceCellId,
      targetCellId: sourceCellId,
    })
  }

  const updateCellSelection = (targetCellId: string) => {
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

  const selectCellRange = (source: string, target: string) => {
    cellSelection.set({
      active: false,
      sourceCellId: source,
      targetCellId: target,
    })
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
        startSelecting: startCellSelection,
        updateTarget: updateCellSelection,
        stopSelecting: stopCellSelection,
        selectRange: selectCellRange,
        clear: clearCellSelection,
      },
    },
  }
}

export const initialise = (context: StoreContext) => {
  const {
    focusedRowId,
    previousFocusedRowId,
    previousFocusedCellId,
    rowLookupMap,
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
    cellSelection,
  } = context

  // Ensure we clear invalid rows from state if they disappear
  rowLookupMap.subscribe(async $rowLookupMap => {
    // We tick here to ensure other derived stores have properly updated.
    // We depend on the row lookup map which is a derived store,
    await tick()
    const $focusedRowId = get(focusedRowId)
    const $selectedRows = get(selectedRows)
    const $hoveredRowId = get(hoveredRowId)
    const hasRow = (id: string) => $rowLookupMap[id] != null

    // Check focused cell
    if ($focusedRowId && !hasRow($focusedRowId)) {
      focusedCellId.set(null)
    }

    // Check hovered row
    if ($hoveredRowId && !hasRow($hoveredRowId)) {
      hoveredRowId.set(null)
    }

    // Check selected rows
    const selectedIds = Object.keys($selectedRows)
    if (selectedIds.length) {
      let newSelectedRows = { ...$selectedRows }
      let selectedRowsNeedsUpdate = false
      for (let i = 0; i < selectedIds.length; i++) {
        if (!hasRow(selectedIds[i])) {
          delete newSelectedRows[selectedIds[i]]
          selectedRowsNeedsUpdate = true
        }
      }
      if (selectedRowsNeedsUpdate) {
        selectedRows.set(newSelectedRows)
      }
    }
  })

  // Remember the last focused row ID so that we can store the previous one
  let lastFocusedRowId: string | null = null
  focusedRowId.subscribe(id => {
    previousFocusedRowId.set(lastFocusedRowId)
    lastFocusedRowId = id
  })

  let lastFocusedCellId: string | null = null
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

  // Clear state when selecting cells
  selectedCellCount.subscribe($selectedCellCount => {
    if ($selectedCellCount) {
      if (get(selectedRowCount)) {
        selectedRows.set({})
      }
    }
  })

  // Ensure the source of cell selection is focused
  cellSelection.subscribe(async ({ sourceCellId, targetCellId }) => {
    if (
      sourceCellId &&
      sourceCellId !== targetCellId &&
      get(focusedCellId) !== sourceCellId
    ) {
      focusedCellId.set(sourceCellId)
    }
  })
}
