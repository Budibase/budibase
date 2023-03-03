<script>
  import { Modal, ModalContent, Button } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { selectedRows, rows, selectedCellId } = getContext("spreadsheet")

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
    await rows.actions.deleteRows(rowsToDelete)

    // Refresh state
    $selectedCellId = null
    $selectedRows = {}
  }
</script>

{#if selectedRowCount}
  <div class="delete-button">
    <Button icon="Delete" size="M" cta on:click={modal.show}>
      Delete {selectedRowCount} row{selectedRowCount === 1 ? "" : "s"}
    </Button>
  </div>
{/if}

<Modal bind:this={modal}>
  <ModalContent
    title="Add screens"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={performDeletion}
    size="M"
  >
    Are you sure you want to delete {selectedRowCount}
    row{selectedRowCount === 1 ? "" : "s"}?
  </ModalContent>
</Modal>

<style>
  .delete-button {
    position: absolute;
    bottom: 30px;
    right: 30px;
  }
  .delete-button :global(.spectrum-Button) {
    background: var(--spectrum-global-color-red-400);
    border-color: var(--spectrum-global-color-red-400);
  }
  .delete-button :global(.spectrum-Button:hover) {
    background: var(--spectrum-global-color-red-500);
    border-color: var(--spectrum-global-color-red-500);
  }
</style>
