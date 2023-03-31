<script>
  import {
    Modal,
    ModalContent,
    ActionButton,
    notifications,
  } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { selectedRows, rows, config } = getContext("sheet")

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
</script>

{#if selectedRowCount}
  <div class="delete-button" data-ignore-click-outside="true">
    <ActionButton
      icon="Delete"
      size="S"
      on:click={modal.show}
      disabled={!$config.allowEditRows}
    >
      Delete {selectedRowCount} row{selectedRowCount === 1 ? "" : "s"}
    </ActionButton>
  </div>
{/if}

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

<style>
  .delete-button :global(.spectrum-ActionButton:not(:disabled) *) {
    color: var(--spectrum-global-color-red-400);
  }
  .delete-button :global(.spectrum-ActionButton:not(:disabled)) {
    border-color: var(--spectrum-global-color-red-400);
  }
  /*.delete-button.disabled :global(.spectrum-ActionButton *) {*/
  /*  color: var(--spectrum-global-color-gray-600);*/
  /*}*/
  /*.delete-button.disabled :global(.spectrum-ActionButton) {*/
  /*  border-color: var(--spectrum-global-color-gray-400);*/
  /*}*/
</style>
