<script>
  import { Modal, ModalContent, ProgressBar } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { getCellID } from "../lib/utils"
  import { sleep } from "../../../utils/utils"

  const {
    selectedRows,
    rows,
    subscribe,
    selectedRowCount,
    visibleColumns,
    selectedCells,
    rowLookupMap,
  } = getContext("grid")
  const duration = 260

  let modal
  let progressPercentage = 0
  let processing = false
  let promptQuantity = 0

  // Deletion callback when confirmed
  const performDuplication = async () => {
    progressPercentage = 0
    processing = true

    // duplicate rows
    const rowsToDuplicate = Object.keys($selectedRows).map(id => {
      return $rowLookupMap[id]
    })
    const newRows = await rows.actions.bulkDuplicate(
      rowsToDuplicate,
      progress => {
        progressPercentage = progress * 100
      }
    )
    await sleep(duration)

    // Select new cells to highlight them
    if (newRows.length) {
      const firstRow = newRows[0]
      const lastRow = newRows[newRows.length - 1]
      const firstCol = $visibleColumns[0]
      const lastCol = $visibleColumns[$visibleColumns.length - 1]
      const startCellId = getCellID(firstRow._id, firstCol.name)
      const endCellId = getCellID(lastRow._id, lastCol.name)
      selectedCells.actions.selectRange(startCellId, endCellId)
    }
    processing = false
  }

  const handleBulkDuplicateRequest = () => {
    promptQuantity = $selectedRowCount
    modal?.show()
  }

  onMount(() => subscribe("request-bulk-duplicate", handleBulkDuplicateRequest))
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Duplicate rows"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={performDuplication}
    size="M"
  >
    Are you sure you want to duplicate {promptQuantity} rows?
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
