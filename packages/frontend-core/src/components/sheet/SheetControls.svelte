<script>
  import { getContext } from "svelte"
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"

  const { selectedRows, rows, selectedCellId } = getContext("spreadsheet")

  let modal

  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: rowCount = $rows.length
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

<div class="controls">
  <div class="buttons">
    <ActionButton icon="Filter" quiet size="M">Filter</ActionButton>
    <ActionButton icon="Group" quiet size="M">Group</ActionButton>
    <ActionButton icon="SortOrderDown" quiet size="M">Sort</ActionButton>
    <ActionButton icon="VisibilityOff" quiet size="M">Hide fields</ActionButton>
  </div>
  <div class="title" />
  <div class="delete">
    {#if selectedRowCount}
      <ActionButton icon="Delete" size="S" on:click={modal.show}>
        Delete {selectedRowCount} row{selectedRowCount === 1 ? "" : "s"}
      </ActionButton>
    {:else}
      {rowCount} row{rowCount === 1 ? "" : "s"}
    {/if}
  </div>
</div>

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
  .controls {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    height: var(--controls-height);
    padding: 0 12px;
    background: var(--background);
    gap: 8px;
    border-bottom: 2px solid var(--spectrum-global-color-gray-200);
  }
  .title {
    font-weight: 600;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: calc(1 * var(--cell-spacing));
    margin-left: -8px;
  }
  .delete {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: var(--spectrum-global-color-gray-900);
    font-size: 14px;
  }
  .delete :global(.spectrum-ActionButton) {
    color: var(--spectrum-global-color-red-600);
  }
  .delete :global(.spectrum-Icon) {
    fill: var(--spectrum-global-color-red-600);
  }
</style>
