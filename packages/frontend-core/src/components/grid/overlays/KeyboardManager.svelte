<script>
  import { getContext, onMount } from "svelte"
  import { debounce } from "../../../utils/utils"

  const {
    enrichedRows,
    focusedCellId,
    visibleColumns,
    focusedRow,
    stickyColumn,
    focusedCellAPI,
    clipboard,
  } = getContext("grid")

  // Global key listener which intercepts all key events
  const handleKeyDown = e => {
    // If nothing selected avoid processing further key presses
    if (!$focusedCellId) {
      if (e.key === "Tab") {
        e.preventDefault()
        focusFirstCell()
      }
      return
    }

    // Always intercept certain key presses
    const api = $focusedCellAPI
    if (e.key === "Escape") {
      api?.blur?.()
    } else if (e.key === "Tab") {
      api?.blur?.()
      changeFocusedColumn(1)
    }

    // Pass the key event to the selected cell and let it decide whether to
    // capture it or not
    if (!api?.isReadonly()) {
      const handled = api?.onKeyDown?.(e)
      if (handled) {
        return
      }
    }

    // Avoid processing events sourced from modals
    if (e.target?.closest?.(".spectrum-Modal")) {
      return
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
          deleteSelectedCell()
          break
        case "Enter":
          focusCell()
          break
        default:
          startEnteringValue(e.key, e.which)
      }
    }
  }

  // Focuses the first cell in the grid
  const focusFirstCell = () => {
    const firstRow = $enrichedRows[0]
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
    const newRow = $enrichedRows[$focusedRow.__idx + delta]
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
        $focusedCellAPI.setValue(parseInt(key))
        $focusedCellAPI.focus()
      } else if (
        ["string", "barcodeqr", "longform"].includes(type) &&
        (keyCodeIsLetter(keyCode) || keyCodeIsNumber(keyCode))
      ) {
        $focusedCellAPI.setValue(key)
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
