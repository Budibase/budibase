import { derived, writable, get, Writable, Readable } from "svelte/store"
import { Helpers } from "@budibase/bbui"
import { parseCellID, getCellID } from "../lib/utils"
import { NewRowID } from "../lib/constants"
import { Store as StoreContext } from "."

type ClipboardStoreData =
  | {
      value: any[][]
      multiCellCopy: true
    }
  | {
      value: any | null | undefined
      multiCellCopy: false
    }

interface ClipboardStore {
  clipboard: Writable<ClipboardStoreData>
}

interface ClipboardDerivedStore {
  copyAllowed: Readable<boolean>
  pasteAllowed: Readable<boolean>
}

interface ClipboardActions {
  clipboard: ClipboardStore["clipboard"] & {
    actions: {
      copy: () => void
      paste: (progressCallback: () => void) => Promise<void>
    }
  }
}

export type Store = ClipboardStore & ClipboardDerivedStore & ClipboardActions

export const createStores = (): ClipboardStore => {
  const clipboard = writable<ClipboardStoreData>({
    value: null,
    multiCellCopy: false,
  })
  return {
    clipboard,
  }
}

export const deriveStores = (context: StoreContext): ClipboardDerivedStore => {
  const { clipboard, focusedCellAPI, selectedCellCount, config, focusedRowId } =
    context

  // Derive whether or not we're able to copy
  const copyAllowed = derived(focusedCellAPI, $focusedCellAPI => {
    return $focusedCellAPI != null
  })

  // Derive whether or not we're able to paste
  const pasteAllowed = derived(
    [clipboard, focusedCellAPI, selectedCellCount, config, focusedRowId],
    ([
      $clipboard,
      $focusedCellAPI,
      $selectedCellCount,
      $config,
      $focusedRowId,
    ]) => {
      if (
        $clipboard.value == null ||
        !$config.canEditRows ||
        !$focusedCellAPI ||
        $focusedRowId === NewRowID
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

export const createActions = (context: StoreContext): ClipboardActions => {
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
    visibleColumns,
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

      // Extract value of each selected cell, accounting for the change cache
      const value = []
      for (const row of $selectedCells) {
        const rowValues = []
        for (const cellId of row) {
          const { rowId = "", field = "" } = parseCellID(cellId)
          const row = {
            ...$rowLookupMap[rowId],
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
      const value = $focusedCellAPI?.getValue()
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
  const paste = async (progressCallback: () => void) => {
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
        await pasteIntoSelectedCells(newValue, progressCallback)
      } else {
        // Multi to single - expand to paste all values
        // Get indices of focused cell
        const $focusedCellId = get(focusedCellId)
        const { rowId, field } = parseCellID($focusedCellId)
        const $rowLookupMap = get(rowLookupMap)
        const $columnLookupMap = get(columnLookupMap)
        const rowIdx = $rowLookupMap[rowId!].__idx
        const colIdx = $columnLookupMap[field!].__idx || 0

        // Get limits of how many rows and columns we're able to paste into
        const $rows = get(rows)
        const $visibleColumns = get(visibleColumns)
        const colCount = $visibleColumns.length
        const rowCount = $rows.length
        const selectedRows = value.length
        const selectedColumns = value[0].length
        const rowExtent = Math.min(selectedRows, rowCount - rowIdx) - 1
        const colExtent = Math.min(selectedColumns, colCount - colIdx) - 1

        // Get the target cell ID (bottom right of our pastable extent)
        const targetRowId = $rows[rowIdx + rowExtent]._id
        const targetColName = $visibleColumns[colIdx + colExtent].name
        const targetCellId = getCellID(targetRowId, targetColName)

        // Paste into target cell range
        if (targetCellId === $focusedCellId) {
          // Single cell edge case
          get(focusedCellAPI)?.setValue(value[0][0])
        } else {
          // Select the new cells to paste into, then paste
          selectedCells.actions.selectRange($focusedCellId, targetCellId)
          await pasteIntoSelectedCells(value, progressCallback)
        }
      }
    } else {
      if (multiCellPaste) {
        // Single to multi - duplicate value to all selected cells
        const newValue = get(selectedCells).map(row => row.map(() => value!))
        await pasteIntoSelectedCells(newValue, progressCallback)
      } else {
        // Single to single - just update the cell's value
        get(focusedCellAPI)?.setValue(value ?? null)
      }
    }
  }

  // Paste the specified value into the currently selected cells
  const pasteIntoSelectedCells = async (
    value: string[][],
    progressCallback: () => any
  ) => {
    const $selectedCells = get(selectedCells)

    // Find the extent at which we can paste
    const rowExtent = Math.min(value.length, $selectedCells.length)
    const colExtent = Math.min(value[0].length, $selectedCells[0].length)

    // Build change map
    let changeMap: Record<string, Record<string, string>> = {}
    for (let rowIdx = 0; rowIdx < rowExtent; rowIdx++) {
      for (let colIdx = 0; colIdx < colExtent; colIdx++) {
        const cellId = $selectedCells[rowIdx][colIdx]
        let { rowId, field } = parseCellID(cellId)
        rowId = rowId!
        field = field!
        if (!changeMap[rowId]) {
          changeMap[rowId] = {}
        }
        changeMap[rowId][field] = value[rowIdx][colIdx]
      }
    }
    await rows.actions.bulkUpdate(changeMap, progressCallback)
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
