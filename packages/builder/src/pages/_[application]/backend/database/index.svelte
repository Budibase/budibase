<script>
  import ModelView from "../../../../database/ModelView.svelte"
  import IndexView from "../../../../database/IndexView.svelte"
  import ModelDataTable from "../../../../database/ModelDataTable"
  import ActionsHeader from "../../../../database/ActionsHeader.svelte"
  import { store, backendUiStore } from "../../../../builderStore"
  import getIcon from "../../../../common/icon"
  import DropdownButton from "../../../../common/DropdownButton.svelte"
  import ActionButton from "../../../../common/ActionButton.svelte"
  import Modal from "../../../../common/Modal.svelte"
  import {
    CreateEditRecordModal,
    CreateEditModelModal,
    CreateEditViewModal,
    CreateDatabaseModal,
    DeleteRecordModal,
    CreateUserModal,
  } from "../../../../database/ModelDataTable/modals"

  let selectedRecord

  function selectRecord(record) {
    selectedRecord = record
  }

  function onClosed() {
    backendUiStore.actions.modals.hide()
  }

  $: recordOpen = $backendUiStore.visibleModal === "RECORD"
  $: modelOpen = $backendUiStore.visibleModal === "MODEL"
  $: viewOpen = $backendUiStore.visibleModal === "VIEW"
  $: databaseOpen = $backendUiStore.visibleModal === "DATABASE"
  $: deleteRecordOpen = $backendUiStore.visibleModal === "DELETE_RECORD"
  $: userOpen = $backendUiStore.visibleModal === "USER"
  $: breadcrumbs = $backendUiStore.breadcrumbs.join(" / ")
</script>

<Modal isOpen={!!$backendUiStore.visibleModal} {onClosed}>
  {#if recordOpen}
    <CreateEditRecordModal record={selectedRecord} {onClosed} />
  {/if}
  {#if modelOpen}
    <CreateEditModelModal {onClosed} />
  {/if}
  {#if viewOpen}
    <CreateEditViewModal {onClosed} />
  {/if}
  {#if databaseOpen}
    <CreateDatabaseModal {onClosed} />
  {/if}
  {#if deleteRecordOpen}
    <DeleteRecordModal record={selectedRecord} {onClosed} />
  {/if}
  {#if userOpen}
    <CreateUserModal {onClosed} />
  {/if}
</Modal>

<div class="root">
  <div class="node-view">
    <div class="database-actions">
      <div class="budibase__label--big">{breadcrumbs}</div>
      {#if $backendUiStore.selectedDatabase.id}
        <ActionButton
          primary
          on:click={() => {
            selectedRecord = null
            backendUiStore.actions.modals.show('RECORD')
          }}>
          Create new record
        </ActionButton>
      {/if}
    </div>
    {#if $backendUiStore.selectedDatabase.id}
      <ModelDataTable {selectRecord} />
    {:else}Please select a database{/if}
  </div>
</div>

<style>
  .root {
    height: 100%;
    position: relative;
  }

  .node-view {
    overflow-y: auto;
    flex: 1 1 auto;
  }

  .database-actions {
    display: flex;
    justify-content: space-between;
  }
</style>
