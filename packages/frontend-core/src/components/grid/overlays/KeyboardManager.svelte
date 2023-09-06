<script>
  import { getContext, onMount } from "svelte"
  import { debounce } from "../../../utils/utils"
  import { NewRowID } from "../lib/constants"

  const {
    rows,
    focusedCellId,
    visibleColumns,
    focusedRow,
    stickyColumn,
    focusedCellAPI,
    clipboard,
    dispatch,
    selectedRows,
    config,
    menu,
    gridFocused,
  } = getContext("grid")

  const ignoredOriginSelectors = [
    ".spectrum-Modal",
    "#builder-side-panel-container",
  ]

  // Global key listener which intercepts all key events
  const handleKeyDown = e => {
    // Ignore completely if the grid is not focused
    if (!$gridFocused) {
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

    // If nothing selected avoid processing further key presses
    if (!$focusedCellId) {
      if (e.key === "Tab" || e.key?.startsWith("Arrow")) {
        e.preventDefault()
        focusFirstCell()
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        if ($config.canAddRows) {
          e.preventDefault()
          dispatch("add-row-inline")
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (Object.keys($selectedRows).length && $config.canDeleteRows) {
          dispatch("request-bulk-delete")
        }
      }
      return
    }

    // Always intercept certain key presses
    const api = $focusedCellAPI
    if (e.key === "Escape") {
      // By setting a tiny timeout here we can ensure that other listeners
      // which depend on being able to read cell state on an escape keypress
      // get a chance to observe the true state before we blur
      if (api?.isActive()) {
        setTimeout(api?.blur, 10)
      } else {
        $focusedCellId = null
      }
      menu.actions.close()
      return
    } else if (e.key === "Tab") {
      e.preventDefault()
      api?.blur?.()
      changeFocusedColumn(1)
      return
    }

    // Pass the key event to the selected cell and let it decide whether to
    // capture it or not
    if (!api?.isReadonly()) {
      const handled = api?.onKeyDown?.(e)
      if (handled) {
        return
      }
    }
    e.preventDefault()

    // Handle the key ourselves
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case "c":
          clipboard.actions.copy()
          break
        case "v":
          if (!api?.isReadonly()) {
            clipboard.actions.paste()
          }
          break
        case "Enter":
          if ($config.canAddRows) {
            dispatch("add-row-inline")
          }
      }
    } else {
      switch (e.key) {
        case "ArrowLeft":
          changeFocusedColumn(-1)
          break
        case "ArrowRight":
          changeFocusedColumn(1)
          break
        case "ArrowUp":
          changeFocusedRow(-1)
          break
        case "ArrowDown":
          changeFocusedRow(1)
          break
        case "Delete":
        case "Backspace":
          if (Object.keys($selectedRows).length && $config.canDeleteRows) {
            dispatch("request-bulk-delete")
          } else {
            deleteSelectedCell()
          }
          break
        case "Enter":
          focusCell()
          break
        case " ":
        case "Space":
          if ($config.canDeleteRows) {
            toggleSelectRow()
          }
          break
        default:
          startEnteringValue(e.key, e.which)
      }
    }
  }

  // Focuses the first cell in the grid
  const focusFirstCell = () => {
    const firstRow = $rows[0]
    if (!firstRow) {
      return
    }
    const firstColumn = $stickyColumn || $visibleColumns[0]
    if (!firstColumn) {
      return
    }
    focusedCellId.set(`${firstRow._id}-${firstColumn.name}`)
  }

  // Changes the focused cell by moving it left or right to a different column
  const changeFocusedColumn = delta => {
    if (!$focusedCellId) {
      return
    }
    const cols = $visibleColumns
    const split = $focusedCellId.split("-")
    const columnName = split[1]
    let newColumnName
    if (columnName === $stickyColumn?.name) {
      const index = delta - 1
      newColumnName = cols[index]?.name
    } else {
      const index = cols.findIndex(col => col.name === columnName) + delta
      if (index === -1) {
        newColumnName = $stickyColumn?.name
      } else {
        newColumnName = cols[index]?.name
      }
    }
    if (newColumnName) {
      $focusedCellId = `${split[0]}-${newColumnName}`
    }
  }

  // Changes the focused cell by moving it up or down to a new row
  const changeFocusedRow = delta => {
    if (!$focusedRow) {
      return
    }
    const newRow = $rows[$focusedRow.__idx + delta]
    if (newRow) {
      const split = $focusedCellId.split("-")
      $focusedCellId = `${newRow._id}-${split[1]}`
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
        $focusedCellAPI.setValue(parseInt(key), { save: false })
        $focusedCellAPI.focus()
      } else if (
        ["string", "barcodeqr", "longform"].includes(type) &&
        (keyCodeIsLetter(keyCode) || keyCodeIsNumber(keyCode))
      ) {
        // Update the value locally but don't save it yet
        $focusedCellAPI.setValue(key, { save: false })
        $focusedCellAPI.focus()
      }
    }
  }

  const toggleSelectRow = () => {
    const id = $focusedRow?._id
    if (!id || id === NewRowID) {
      return
    }
    selectedRows.actions.toggleRow(id)
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>
