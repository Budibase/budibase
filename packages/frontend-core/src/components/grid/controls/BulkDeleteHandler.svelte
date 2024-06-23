<script>
  import { Modal, ModalContent } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { parseCellID } from "../lib/utils"

  const {
    selectedRows,
    rows,
    subscribe,
    notifications,
    menu,
    selectedCellCount,
    selectedRowCount,
    selectedCells,
  } = getContext("grid")

  let rowsModal
  let cellsModal

  $: rowsToDelete = Object.entries($selectedRows)
    .map(entry => $rows.find(x => x._id === entry[0]))
    .filter(x => x != null)

  const handleBulkDeleteRequest = () => {
    if ($selectedRowCount) {
      rowsModal?.show()
    } else if ($selectedCellCount) {
      cellsModal?.show()
    }
  }

  const bulkDeleteRows = async () => {
    const count = rowsToDelete.length
    await rows.actions.deleteRows(rowsToDelete)
    $notifications.success(`Deleted ${count} row${count === 1 ? "" : "s"}`)

    // Ensure menu is closed, as we may have triggered this from there
    menu.actions.close()
  }

  const bulkDeleteCells = async () => {
    let changeMap = {}
    for (let row of $selectedCells) {
      for (let cellId of row) {
        const { rowId, field } = parseCellID(cellId)
        if (!changeMap[rowId]) {
          changeMap[rowId] = {}
        }
        changeMap[rowId][field] = null
      }
    }
    await rows.actions.bulkUpdate(changeMap)

    // Ensure menu is closed, as we may have triggered this from there
    menu.actions.close()
  }

  onMount(() => subscribe("request-bulk-delete", handleBulkDeleteRequest))
</script>

<Modal bind:this={rowsModal}>
  <ModalContent
    title="Delete rows"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={bulkDeleteRows}
    size="M"
  >
    Are you sure you want to delete {$selectedRowCount}
    row{$selectedRowCount === 1 ? "" : "s"}?
  </ModalContent>
</Modal>

<Modal bind:this={cellsModal}>
  <ModalContent
    title="Delete cells"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={bulkDeleteCells}
    size="M"
  >
    Are you sure you want to delete {$selectedCellCount}
    cell{$selectedCellCount === 1 ? "" : "s"}?
  </ModalContent>
</Modal>
