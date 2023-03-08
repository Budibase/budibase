<script>
  import { getContext, onMount } from "svelte"

  const { rows, selectedCellId, columns, selectedCellRow, stickyColumn } =
    getContext("sheet")

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

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  })
</script>
