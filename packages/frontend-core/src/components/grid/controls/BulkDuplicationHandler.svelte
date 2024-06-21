<script>
  import { Modal, ModalContent } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"
  import { getCellID } from "../lib/utils"

  const {
    selectedRows,
    rows,
    subscribe,
    focusedCellId,
    stickyColumn,
    columns,
    selectedRowCount,
  } = getContext("grid")

  let modal

  // Deletion callback when confirmed
  const performDuplication = async () => {
    const rowsToDuplicate = Object.keys($selectedRows).map(id => {
      return rows.actions.getRow(id)
    })
    const newRows = await rows.actions.bulkDuplicate(rowsToDuplicate)
    if (newRows[0]) {
      const column = $stickyColumn?.name || $columns[0].name
      $focusedCellId = getCellID(newRows[0]._id, column)
    }
  }

  onMount(() => subscribe("request-bulk-duplicate", () => modal?.show()))
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Duplicate rows"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={performDuplication}
    size="M"
  >
    Are you sure you want to duplicate {$selectedRowCount}
    row{$selectedRowCount === 1 ? "" : "s"}?
    {#if $selectedRowCount >= 10}
      <br /><br />
      This may take a few seconds.
    {/if}
  </ModalContent>
</Modal>
