import { derived, writable, get } from "svelte/store"
import { Helpers } from "@budibase/bbui"
import { parseCellID } from "../lib/utils"

export const createStores = () => {
  const clipboard = writable({
    value: null,
    multiCellCopy: false,
  })
  return {
    clipboard,
  }
}

export const deriveStores = context => {
  const { clipboard, focusedCellAPI, selectedCellCount } = context

  // Derive whether or not we're able to copy
  const copyAllowed = derived(focusedCellAPI, $focusedCellAPI => {
    return $focusedCellAPI != null
  })

  // Derive whether or not we're able to paste
  const pasteAllowed = derived(
    [clipboard, focusedCellAPI, selectedCellCount],
    ([$clipboard, $focusedCellAPI, $selectedCellCount]) => {
      if ($clipboard.value == null || !$focusedCellAPI) {
        return false
      }
      // Prevent pasting into a single cell, if we have a single cell value and
      // this cell is readonly
      const multiCellPaste = $selectedCellCount > 1
      if (
        !$clipboard.multiCellCopy &&
        !multiCellPaste &&
        $focusedCellAPI.isReadonly()
      ) {
        return false
      }
      return true
    }
  )

  return {
    copyAllowed,
    pasteAllowed,
  }
}

export const createActions = context => {
  const {
    clipboard,
    focusedCellAPI,
    copyAllowed,
    pasteAllowed,
    selectedCells,
    rowLookupMap,
    rowChangeCache,
    rows,
    columnLookupMap,
  } = context

  // Copies the currently selected value (or values)
  const copy = () => {
    if (!get(copyAllowed)) {
      return
    }
    const cellIds = Object.keys(get(selectedCells))
    const $focusedCellAPI = get(focusedCellAPI)
    const multiCellCopy = cellIds.length > 1

    // Multiple values to copy
    if (multiCellCopy) {
      const $rowLookupMap = get(rowLookupMap)
      const $rowChangeCache = get(rowChangeCache)
      const $rows = get(rows)
      const $columnLookupMap = get(columnLookupMap)

      // Go through each selected cell and group all selected cell values by
      // their row ID. Order is important for pasting, so we store the index of
      // both rows and values.
      let map = {}
      for (let cellId of cellIds) {
        const { id, field } = parseCellID(cellId)
        const index = $rowLookupMap[id]
        if (!map[id]) {
          map[id] = {
            order: index,
            values: [],
          }
        }
        const row = {
          ...$rows[index],
          ...$rowChangeCache[id],
        }
        const columnIndex = $columnLookupMap[field]
        map[id].values.push({
          value: row[field],
          order: columnIndex,
        })
      }

      // Sort rows by order
      let value = []
      const sortedRowValues = Object.values(map)
        .toSorted((a, b) => a.order - b.order)
        .map(x => x.values)

      // Sort all values in each row by order
      for (let rowValues of sortedRowValues) {
        value.push(
          rowValues.toSorted((a, b) => a.order - b.order).map(x => x.value)
        )
      }

      // Update state
      clipboard.set({
        value,
        multiCellCopy: true,
      })
    } else {
      // Single value to copy
      const value = $focusedCellAPI.getValue()
      clipboard.set({
        value,
        multiCellCopy,
      })

      // Also copy a stringified version to the clipboard
      let stringified = ""
      if (value != null && value !== "") {
        // Only conditionally stringify to avoid redundant quotes around text
        stringified = typeof value === "object" ? JSON.stringify(value) : value
      }
      Helpers.copyToClipboard(stringified)
    }
  }

  // Pastes the previously copied value(s) into the selected cell(s)
  const paste = async () => {
    if (!get(pasteAllowed)) {
      return
    }
    const $clipboard = get(clipboard)
    const $focusedCellAPI = get(focusedCellAPI)
    if ($clipboard.value == null || !$focusedCellAPI) {
      return
    }

    // Check if we're pasting into one or more cells
    const $selectedCells = get(selectedCells)
    const cellIds = Object.keys($selectedCells)
    const multiCellPaste = cellIds.length > 1

    if ($clipboard.multiCellCopy) {
      if (multiCellPaste) {
        // Multi to multi (only paste selected cells)
        const value = $clipboard.value

        // Find the top left index so we can find the relative offset for each
        // cell
        let rowIndices = []
        let columnIndices = []
        for (let cellId of cellIds) {
          rowIndices.push($selectedCells[cellId].rowIdx)
          columnIndices.push($selectedCells[cellId].colIdx)
        }
        const minRowIdx = Math.min(...rowIndices)
        const minColIdx = Math.min(...columnIndices)

        // Build change map of values to patch
        let changeMap = {}
        const $rowLookupMap = get(rowLookupMap)
        const $columnLookupMap = get(columnLookupMap)
        for (let cellId of cellIds) {
          const { id, field } = parseCellID(cellId)
          const rowIdx = $rowLookupMap[id] - minRowIdx
          const colIdx = $columnLookupMap[field] - minColIdx
          if (colIdx in (value[rowIdx] || [])) {
            if (!changeMap[id]) {
              changeMap[id] = {}
            }
            changeMap[id][field] = value[rowIdx][colIdx]
          }
        }
        await rows.actions.bulkUpdate(changeMap)
      } else {
        // Multi to single (expand to paste all values)
        // TODO
      }
    } else {
      if (multiCellPaste) {
        // Single to multi (duplicate value in all selected cells)
        let changeMap = {}
        for (let cellId of cellIds) {
          const { id, field } = parseCellID(cellId)
          if (!changeMap[id]) {
            changeMap[id] = {}
          }
          changeMap[id][field] = $clipboard.value
        }
        await rows.actions.bulkUpdate(changeMap)
      } else {
        // Single to single
        $focusedCellAPI.setValue($clipboard.value)
      }
    }
  }

  return {
    clipboard: {
      ...clipboard,
      actions: {
        copy,
        paste,
      },
    },
  }
}
