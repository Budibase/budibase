import { derived, writable, get } from "svelte/store"
import { getCellID, parseCellID } from "../lib/utils"

export const createStores = () => {
  const cellSelection = writable({
    active: false,
    sourceCellId: null,
    targetCellId: null,
  })

  return {
    cellSelection,
  }
}

export const deriveStores = context => {
  const {
    cellSelection,
    rowLookupMap,
    columnLookupMap,
    rows,
    allVisibleColumns,
  } = context

  const isSelectingCells = derived(cellSelection, $cellSelection => {
    return $cellSelection.active
  })

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
          map[cellId] = true
        }
      }
      return map
    }
  )

  const selectedCellCount = derived(selectedCells, $selectedCells => {
    return Object.keys($selectedCells).length
  })

  return {
    isSelectingCells,
    selectedCells,
    selectedCellCount,
  }
}

export const createActions = context => {
  const { cellSelection } = context

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
    cellSelection: {
      ...cellSelection,
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
  const { selectedCellCount, selectedRowCount, selectedRows } = context

  selectedCellCount.subscribe($selectedCellCount => {
    if ($selectedCellCount && get(selectedRowCount)) {
      selectedRows.set({})
    }
  })
}
