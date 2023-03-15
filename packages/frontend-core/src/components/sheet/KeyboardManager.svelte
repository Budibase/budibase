<script>
  import { getContext, onMount } from "svelte"
  import { debounce } from "../../utils/utils"

  const {
    rows,
    selectedCellId,
    visibleColumns,
    selectedCellRow,
    stickyColumn,
    selectedCellAPI,
  } = getContext("sheet")

  const handleKeyDown = e => {
    // If nothing selected avoid processing further key presses
    if (!$selectedCellId) {
      if (e.key === "Tab") {
        selectFirstCell()
      }
      return
    }

    // Always intercept certain key presses
    const api = $selectedCellAPI
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
    selectedCellId.set(`${firstRow._id}-${firstColumn.name}`)
  }

  const changeSelectedColumn = delta => {
    if (!$selectedCellId) {
      return
    }
    const cols = $visibleColumns
    const split = $selectedCellId.split("-")
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
      $selectedCellId = `${split[0]}-${newColumnName}`
    }
  }

  const changeSelectedRow = delta => {
    if (!$selectedCellRow) {
      return
    }
    const newRow = $rows[$selectedCellRow.__idx + delta]
    if (newRow) {
      const split = $selectedCellId.split("-")
      $selectedCellId = `${newRow._id}-${split[1]}`
    }
  }

  // Debounce to avoid holding down delete and spamming requests
  const deleteSelectedCell = debounce(() => {
    if (!$selectedCellId) {
      return
    }
    if ($selectedCellAPI?.isReadonly()) {
      return
    }
    const [rowId, column] = $selectedCellId.split("-")
    rows.actions.updateRow(rowId, column, null)
  }, 100)

  const focusSelectedCell = () => {
    if ($selectedCellAPI?.isReadonly()) {
      return
    }
    $selectedCellAPI?.focus?.()
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>
