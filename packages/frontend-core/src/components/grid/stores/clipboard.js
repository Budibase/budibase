import { derived, writable, get } from "svelte/store"
import { Helpers } from "@budibase/bbui"
import { parseCellID, getCellID } from "../lib/utils"

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
  const { clipboard, focusedCellAPI, selectedCellCount, config } = context

  // Derive whether or not we're able to copy
  const copyAllowed = derived(focusedCellAPI, $focusedCellAPI => {
    return $focusedCellAPI != null
  })

  // Derive whether or not we're able to paste
  const pasteAllowed = derived(
    [clipboard, focusedCellAPI, selectedCellCount, config],
    ([$clipboard, $focusedCellAPI, $selectedCellCount, $config]) => {
      if (
        $clipboard.value == null ||
        !$config.canEditRows ||
        !$focusedCellAPI
      ) {
        return false
      }

      // Prevent single-single pasting if the cell is readonly
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
    selectedCellCount,
    rowLookupMap,
    rowChangeCache,
    rows,
    focusedCellId,
    columnLookupMap,
    allVisibleColumns,
  } = context

  // Copies the currently selected value (or values)
  const copy = () => {
    if (!get(copyAllowed)) {
      return
    }
    const $selectedCells = get(selectedCells)
    const $focusedCellAPI = get(focusedCellAPI)
    const $selectedCellCount = get(selectedCellCount)
    const multiCellCopy = $selectedCellCount > 1

    // Multiple values to copy
    if (multiCellCopy) {
      const $rowLookupMap = get(rowLookupMap)
      const $rowChangeCache = get(rowChangeCache)
      const $rows = get(rows)

      // Extract value of each selected cell, accounting for the change cache
      let value = []
      for (let row of $selectedCells) {
        const rowValues = []
        for (let cellId of row) {
          const { rowId, field } = parseCellID(cellId)
          const rowIndex = $rowLookupMap[rowId]
          const row = {
            ...$rows[rowIndex],
            ...$rowChangeCache[rowId],
          }
          rowValues.push(row[field])
        }
        value.push(rowValues)
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
    const { value, multiCellCopy } = get(clipboard)
    const multiCellPaste = get(selectedCellCount) > 1

    // Choose paste strategy
    if (multiCellCopy) {
      if (multiCellPaste) {
        // Multi to multi - try pasting into all selected cells
        let newValue = value

        // If we are pasting into more rows than we copied, but the number of
        // columns match, then repeat the copied values as required
        const $selectedCells = get(selectedCells)
        const selectedRows = $selectedCells.length
        const selectedColumns = $selectedCells[0].length
        const copiedRows = value.length
        const copiedColumns = value[0].length
        if (selectedRows > copiedRows && selectedColumns === copiedColumns) {
          newValue = []
          for (let i = 0; i < selectedRows; i++) {
            newValue.push(value[i % copiedRows])
          }
        }

        // Paste the new value
        await pasteIntoSelectedCells(newValue)
      } else {
        // Multi to single - expand to paste all values
        // Get indices of focused cell
        const $focusedCellId = get(focusedCellId)
        const { rowId, field } = parseCellID($focusedCellId)
        const $rowLookupMap = get(rowLookupMap)
        const $columnLookupMap = get(columnLookupMap)
        const rowIdx = $rowLookupMap[rowId]
        const colIdx = $columnLookupMap[field]

        // Get limits of how many rows and columns we're able to paste into
        const $rows = get(rows)
        const $allVisibleColumns = get(allVisibleColumns)
        const colCount = $allVisibleColumns.length
        const rowCount = $rows.length
        const selectedRows = value.length
        const selectedColumns = value[0].length
        const rowExtent = Math.min(selectedRows, rowCount - rowIdx) - 1
        const colExtent = Math.min(selectedColumns, colCount - colIdx) - 1

        // Get the target cell ID (bottom right of our pastable extent)
        const targetRowId = $rows[rowIdx + rowExtent]._id
        const targetColName = $allVisibleColumns[colIdx + colExtent].name
        const targetCellId = getCellID(targetRowId, targetColName)

        // Paste into target cell range
        if (targetCellId === $focusedCellId) {
          // Single cell edge case
          get(focusedCellAPI).setValue(value[0][0])
        } else {
          // Select the new cells to paste into, then paste
          selectedCells.actions.selectRange($focusedCellId, targetCellId)
          await pasteIntoSelectedCells(value)
        }
      }
    } else {
      if (multiCellPaste) {
        // Single to multi - duplicate value to all selected cells
        const newValue = get(selectedCells).map(row => row.map(() => value))
        await pasteIntoSelectedCells(newValue)
      } else {
        // Single to single - just update the cell's value
        get(focusedCellAPI).setValue(value)
      }
    }
  }

  // Paste the specified value into the currently selected cells
  const pasteIntoSelectedCells = async value => {
    const $selectedCells = get(selectedCells)

    // Find the extent at which we can paste
    const rowExtent = Math.min(value.length, $selectedCells.length)
    const colExtent = Math.min(value[0].length, $selectedCells[0].length)

    // Build change map
    let changeMap = {}
    for (let rowIdx = 0; rowIdx < rowExtent; rowIdx++) {
      for (let colIdx = 0; colIdx < colExtent; colIdx++) {
        const cellId = $selectedCells[rowIdx][colIdx]
        const { rowId, field } = parseCellID(cellId)
        if (!changeMap[rowId]) {
          changeMap[rowId] = {}
        }
        changeMap[rowId][field] = value[rowIdx][colIdx]
      }
    }
    await rows.actions.bulkUpdate(changeMap)
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
