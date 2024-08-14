<script>
  import { getContext, onMount } from "svelte"
  import { debounce } from "../../../utils/utils"
  import { getCellID, parseCellID } from "../lib/utils"
  import { NewRowID } from "../lib/constants"

  const {
    rows,
    focusedCellId,
    visibleColumns,
    rowLookupMap,
    focusedCellAPI,
    dispatch,
    selectedRowCount,
    config,
    menu,
    gridFocused,
    keyboardBlocked,
    selectedCellCount,
    selectedCells,
    cellSelection,
    columnLookupMap,
    focusedRowId,
  } = getContext("grid")

  const ignoredOriginSelectors = [
    ".spectrum-Modal",
    ".date-time-popover",
    "#builder-side-panel-container",
    "[data-grid-ignore]",
  ]

  // Global key listener which intercepts all key events
  const handleKeyDown = e => {
    // Ignore completely if the grid is not focused
    if (!$gridFocused || $keyboardBlocked) {
      return
    }

    // Avoid processing events sourced from certain origins
    if (e.target?.closest) {
      for (let selector of ignoredOriginSelectors) {
        if (e.target.closest(selector)) {
          return
        }
      }
    }

    // Sugar for preventing default
    const handle = fn => {
      e.preventDefault()
      fn()
    }

    // Handle certain key presses regardless of selection state
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case "c":
          return handle(() => dispatch("copy"))
        case "v":
          return dispatch("paste")
        case "Enter":
          return handle(() => {
            if ($config.canAddRows) {
              dispatch("add-row-inline")
            }
          })
      }
    }

    // Handle certain key presses if we have cells selected
    if ($selectedCellCount) {
      switch (e.key) {
        case "Escape":
          return handle(selectedCells.actions.clear)
        case "Delete":
        case "Backspace":
          return handle(() => dispatch("request-bulk-delete"))
      }
    }

    // Handle certain key presses only if no cell focused
    if (!$focusedCellId) {
      if (e.key === "Tab" || e.key?.startsWith("Arrow")) {
        handle(focusFirstCell)
      } else if (e.key === "Delete" || e.key === "Backspace") {
        handle(() => {
          if ($selectedRowCount && $config.canDeleteRows) {
            dispatch("request-bulk-delete")
          }
        })
      }
      // Avoid processing anything else
      return
    }

    // Always intercept certain key presses
    const api = $focusedCellAPI
    if (e.key === "Escape") {
      // By setting a tiny timeout here we can ensure that other listeners
      // which depend on being able to read cell state on an escape keypress
      // get a chance to observe the true state before we blur
      return handle(() => {
        if (api?.isActive()) {
          setTimeout(api?.blur, 10)
        } else {
          $focusedCellId = null
        }
        menu.actions.close()
      })
    } else if (e.key === "Tab") {
      return handle(() => {
        api?.blur?.()
        changeFocusedColumn(1)
      })
    }

    // Pass the key event to the selected cell and let it decide whether to
    // capture it or not
    if (!api?.isReadonly()) {
      const handled = api?.onKeyDown?.(e)
      if (handled) {
        return
      }
    }

    // Handle the key ourselves
    if (e.metaKey || e.ctrlKey) {
      //
    } else {
      switch (e.key) {
        case "ArrowLeft":
          return handle(() => changeFocusedColumn(-1, e.shiftKey))
        case "ArrowRight":
          return handle(() => changeFocusedColumn(1, e.shiftKey))
        case "ArrowUp":
          return handle(() => changeFocusedRow(-1, e.shiftKey))
        case "ArrowDown":
          return handle(() => changeFocusedRow(1, e.shiftKey))
        case "Delete":
        case "Backspace":
          return handle(() => {
            if ($selectedRowCount && $config.canDeleteRows) {
              dispatch("request-bulk-delete")
            } else {
              deleteSelectedCell()
            }
          })
        case "Enter":
          return handle(focusCell)
        default:
          return handle(() => startEnteringValue(e.key, e.which))
      }
    }
  }

  // Focuses the first cell in the grid
  const focusFirstCell = () => {
    const firstRow = $rows[0]
    if (!firstRow) {
      return
    }
    const firstColumn = $visibleColumns[0]
    if (!firstColumn) {
      return
    }
    focusedCellId.set(getCellID(firstRow._id, firstColumn.name))
  }

  // Changes the focused cell by moving it left or right to a different column
  const changeFocusedColumn = (delta, shiftKey) => {
    // Determine which cell we are working with
    let sourceCellId = $focusedCellId
    if (shiftKey && $selectedCellCount) {
      sourceCellId = $cellSelection.targetCellId
    }
    if (!sourceCellId) {
      return
    }

    // Determine the new position for this cell
    const { rowId, field } = parseCellID(sourceCellId)
    const colIdx = $columnLookupMap[field].__idx
    const nextColumn = $visibleColumns[colIdx + delta]
    if (!nextColumn) {
      return
    }
    const targetCellId = getCellID(rowId, nextColumn.name)

    // Apply change
    if (shiftKey) {
      if ($selectedCellCount) {
        // We have selected cells and still are holding shift - update selection
        selectedCells.actions.updateTarget(targetCellId)

        // Restore focused cell if this removes the selection
        if (!$selectedCellCount) {
          focusedCellId.set(targetCellId)
        }
      } else {
        // We have no selection but are holding shift - select these cells
        selectedCells.actions.selectRange(sourceCellId, targetCellId)
      }
    } else {
      // We aren't holding shift - just focus this cell
      focusedCellId.set(targetCellId)
    }
  }

  // Changes the focused cell by moving it up or down to a new row
  const changeFocusedRow = (delta, shiftKey) => {
    // Ignore for new row component
    if ($focusedRowId === NewRowID) {
      return
    }

    // Determine which cell we are working with
    let sourceCellId = $focusedCellId
    if (shiftKey && $selectedCellCount) {
      sourceCellId = $cellSelection.targetCellId
    }
    if (!sourceCellId) {
      return
    }

    // Determine the new position for this cell
    const { rowId, field } = parseCellID(sourceCellId)
    const rowIdx = $rowLookupMap[rowId].__idx
    const newRow = $rows[rowIdx + delta]
    if (!newRow) {
      return
    }
    const targetCellId = getCellID(newRow._id, field)

    // Apply change
    if (shiftKey) {
      if ($selectedCellCount) {
        // We have selected cells and still are holding shift - update selection
        selectedCells.actions.updateTarget(targetCellId)

        // Restore focused cell if this removes the selection
        if (!$selectedCellCount) {
          focusedCellId.set(targetCellId)
        }
      } else {
        // We have no selection but are holding shift - select these cells
        selectedCells.actions.selectRange(sourceCellId, targetCellId)
      }
    } else {
      // We aren't holding shift - just focus this cell
      focusedCellId.set(targetCellId)
    }
  }

  // Debounce to avoid holding down delete and spamming requests
  const deleteSelectedCell = debounce(() => {
    if ($focusedCellAPI?.isReadonly()) {
      return
    }
    $focusedCellAPI.setValue(null)
  }, 100)

  // Focuses the current cell for editing
  const focusCell = () => {
    if ($focusedCellAPI?.isReadonly()) {
      return
    }
    $focusedCellAPI?.focus?.()
  }

  // Utils to identify a key code
  const keyCodeIsNumber = keyCode => keyCode >= 48 && keyCode <= 57
  const keyCodeIsLetter = keyCode => keyCode >= 65 && keyCode <= 90

  // Focuses the cell and starts entering a new value
  const startEnteringValue = (key, keyCode) => {
    if ($focusedCellAPI && !$focusedCellAPI.isReadonly()) {
      const type = $focusedCellAPI.getType()
      if (type === "number" && keyCodeIsNumber(keyCode)) {
        // Update the value locally but don't save it yet
        $focusedCellAPI.setValue(parseInt(key), { apply: false })
        $focusedCellAPI.focus()
      } else if (
        ["string", "barcodeqr", "longform"].includes(type) &&
        (keyCodeIsLetter(keyCode) || keyCodeIsNumber(keyCode))
      ) {
        // Update the value locally but don't save it yet
        $focusedCellAPI.setValue(key, { apply: false })
        $focusedCellAPI.focus()
      }
    }
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>
