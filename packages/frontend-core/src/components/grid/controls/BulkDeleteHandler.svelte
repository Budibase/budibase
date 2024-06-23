<script>
  import { Modal, ModalContent, ProgressBar } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { parseCellID } from "../lib/utils"
  import { sleep } from "../../../utils/utils"

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
  const duration = 260

  let rowsModal
  let cellsModal
  let processing = false
  let progressPercentage = 0

  $: rowsToDelete = Object.entries($selectedRows)
    .map(entry => $rows.find(x => x._id === entry[0]))
    .filter(x => x != null)

  const handleBulkDeleteRequest = () => {
    progressPercentage = 0
    menu.actions.close()
    if ($selectedRowCount) {
      rowsModal?.show()
    } else if ($selectedCellCount) {
      cellsModal?.show()
    }
  }

  const bulkDeleteRows = async () => {
    processing = true
    const count = rowsToDelete.length
    await rows.actions.deleteRows(rowsToDelete, progress => {
      progressPercentage = progress * 100
    })
    await sleep(duration)
    $notifications.success(`Deleted ${count} row${count === 1 ? "" : "s"}`)
    processing = false
  }

  const bulkDeleteCells = async () => {
    processing = true
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
    await rows.actions.bulkUpdate(changeMap, progress => {
      progressPercentage = progress * 100
    })
    await sleep(duration)
    processing = false
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
    {#if processing}
      <ProgressBar
        size="L"
        value={progressPercentage}
        {duration}
        width="100%"
      />
    {/if}
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
    {#if processing}
      <ProgressBar
        size="L"
        value={progressPercentage}
        {duration}
        width="100%"
      />
    {/if}
  </ModalContent>
</Modal>
