<script>
  import { Modal, ModalContent, notifications } from "@budibase/bbui"
  import { getContext, onMount } from "svelte"

  const { selectedRows, rows, subscribe } = getContext("grid")

  let modal

  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: rowsToDelete = Object.entries($selectedRows)
    .map(entry => {
      if (entry[1] === true) {
        return $rows.find(x => x._id === entry[0])
      } else {
        return null
      }
    })
    .filter(x => x != null)

  // Deletion callback when confirmed
  const performDeletion = async () => {
    const count = rowsToDelete.length
    await rows.actions.deleteRows(rowsToDelete)
    notifications.success(`Deleted ${count} row${count === 1 ? "" : "s"}`)
  }

  onMount(() => subscribe("request-bulk-delete", () => modal?.show()))
</script>

<Modal bind:this={modal}>
  <ModalContent
    title="Delete rows"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={performDeletion}
    size="M"
  >
    Are you sure you want to delete {selectedRowCount}
    row{selectedRowCount === 1 ? "" : "s"}?
  </ModalContent>
</Modal>
