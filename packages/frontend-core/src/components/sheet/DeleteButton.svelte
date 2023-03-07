<script>
  import { Modal, ModalContent, ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { selectedRows, rows } = getContext("sheet")

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
  }
</script>

{#if selectedRowCount}
  <div class="delete-button">
    <ActionButton icon="Delete" size="S" on:click={modal.show}>
      Delete {selectedRowCount} row{selectedRowCount === 1 ? "" : "s"}
    </ActionButton>
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
  }
  .delete-button :global(.spectrum-ActionButton *) {
    color: var(--spectrum-global-color-red-400);
  }
  .delete-button :global(.spectrum-ActionButton) {
    border-color: var(--spectrum-global-color-red-400);
  }
</style>
