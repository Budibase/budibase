<script>
  import { getContext, onMount } from "svelte"

  const { rows, selectedCellId, columns, selectedCellRow } = getContext("sheet")

  const handleKeyDown = e => {
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
    }
  }

  const changeSelectedColumn = delta => {
    const cellId = $selectedCellId
    if (!cellId) {
      return
    }
    const cols = $columns
    const split = cellId.split("-")
    const columnName = split[1]
    const column = cols.findIndex(col => col.name === columnName)
    const newColumn = cols[column + delta]
    if (newColumn) {
      $selectedCellId = `${split[0]}-${newColumn.name}`
    }
  }

  const changeSelectedRow = delta => {
    const row = $selectedCellRow
    const cellId = $selectedCellId
    if (!row) {
      return
    }
    const newRow = $rows[row.__idx + delta]
    if (newRow) {
      const split = cellId.split("-")
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

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>
