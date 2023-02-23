<script>
  import { getContext } from "svelte"
  import { ActionButton } from "@budibase/bbui"

  const {
    selectedRows,
    rows,
    selectedCellId,
    hoveredRowId,
    tableId,
    spreadsheetAPI,
  } = getContext("spreadsheet")
  const { API, confirmationStore } = getContext("sdk")

  $: selectedRowCount = Object.values($selectedRows).filter(x => !!x).length
  $: rowCount = $rows.length

  const deleteRows = () => {
    // Fetch full row objects to be deleted
    const rowsToDelete = Object.entries($selectedRows)
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
      await API.deleteRows({
        tableId: $tableId,
        rows: rowsToDelete,
      })
      await spreadsheetAPI.refreshData()

      // Refresh state
      $selectedCellId = null
      $hoveredRowId = null
      $selectedRows = {}
    }

    // Show confirmation
    confirmationStore.actions.showConfirmation(
      "Delete rows",
      `Are you sure you want to delete ${selectedRowCount} row${
        selectedRowCount === 1 ? "" : "s"
      }?`,
      performDeletion
    )
  }
</script>

<div class="controls">
  <div class="buttons">
    <ActionButton icon="Filter" size="S">Filter</ActionButton>
    <ActionButton icon="Group" size="S">Group</ActionButton>
    <ActionButton icon="SortOrderDown" size="S">Sort</ActionButton>
    <ActionButton icon="VisibilityOff" size="S">Hide fields</ActionButton>
  </div>
  <div class="title">Sales Records</div>
  <div class="delete">
    {#if selectedRowCount}
      <ActionButton icon="Delete" size="S" on:click={deleteRows}>
        Delete {selectedRowCount} row{selectedRowCount === 1 ? "" : "s"}
      </ActionButton>
    {:else}
      {rowCount} row{rowCount === 1 ? "" : "s"}
    {/if}
  </div>
</div>

<style>
  .controls {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    height: 36px;
    padding: 0 12px;
    background: var(--spectrum-global-color-gray-200);
    gap: 8px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-400);
  }
  .title {
    font-weight: 600;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--cell-spacing);
  }
  .delete {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: var(--spectrum-global-color-gray-700);
  }
  .delete :global(.spectrum-ActionButton) {
    color: var(--spectrum-global-color-red-600);
  }
  .delete :global(.spectrum-Icon) {
    fill: var(--spectrum-global-color-red-600);
  }
</style>
