<script>
  import { getContext, onMount } from "svelte"
  import { get } from "svelte/store"

  const {
    rows,
    selectedCellId,
    columns,
    selectedCellRow,
    stickyColumn,
    selectedCellAPI,
  } = getContext("sheet")

  const handleKeyDown = e => {
    const api = get(selectedCellAPI)
    if (!api) {
      return
    }

    // Always intercept certain key presses
    if (e.key === "Escape") {
      api.blur()
    } else if (e.key === "Tab") {
      api.blur()
      changeSelectedColumn(1)
    }

    // Pass the key event to the selected cell and let it decide whether to
    // capture it or not
    const handled = api.onKeyDown?.(e)
    if (handled) {
      return
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

  const changeSelectedColumn = delta => {
    if (!$selectedCellId) {
      return
    }
    const cols = $columns
    const split = $selectedCellId.split("-")
    const columnName = split[1]
    let newColumnName
    if (columnName === $stickyColumn?.name) {
      const index = delta - 1
      newColumnName = $columns[index]?.name
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

  const deleteSelectedCell = () => {
    if (!$selectedCellId) {
      return
    }
    const [rowId, column] = $selectedCellId.split("-")
    rows.actions.updateRow(rowId, column, null)
  }

  const focusSelectedCell = () => {
    $selectedCellAPI?.focus()
  }

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>
