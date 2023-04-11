<script>
  import { getContext, onMount } from "svelte"
  import { debounce } from "../../../utils/utils"

  const {
    rows,
    focusedCellId,
    visibleColumns,
    focusedRow,
    stickyColumn,
    focusedCellAPI,
  } = getContext("sheet")

  const handleKeyDown = e => {
    // If nothing selected avoid processing further key presses
    if (!$focusedCellId) {
      if (e.key === "Tab") {
        selectFirstCell()
      }
      return
    }

    // Always intercept certain key presses
    const api = $focusedCellAPI
    if (e.key === "Escape") {
      api?.blur?.()
    } else if (e.key === "Tab") {
      api?.blur?.()
      changeSelectedColumn(1)
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
    switch (e.key) {
      case "ArrowLeft":
        changeSelectedColumn(-1)
        break
      case "ArrowRight":
        changeSelectedColumn(1)
        break
      case "ArrowUp":
        changeSelectedRow(-1)
        break
      case "ArrowDown":
        changeSelectedRow(1)
        break
      case "Delete":
        deleteSelectedCell()
        break
      case "Enter":
        focusSelectedCell()
        break
    }
  }

  const selectFirstCell = () => {
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

  const changeSelectedColumn = delta => {
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

  const changeSelectedRow = delta => {
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
    $focusedCellAPI.updateValue(null)
  }, 100)

  const focusSelectedCell = () => {
    if ($focusedCellAPI?.isReadonly()) {
      return
    }
    $focusedCellAPI?.focus?.()
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>
