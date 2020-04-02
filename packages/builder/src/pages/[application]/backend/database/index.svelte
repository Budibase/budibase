<script>
  import ModelDataTable from "components/database/ModelDataTable"
  import { store, backendUiStore } from "builderStore"
  import getIcon from "components/common/icon"
  import DropdownButton from "components/common/DropdownButton.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import Modal from "components/common/Modal.svelte"
  import * as api from "components/database/ModelDataTable/api"
  import {
    CreateEditRecordModal,
    CreateEditModelModal,
    CreateEditViewModal,
    CreateDatabaseModal,
    DeleteRecordModal,
    CreateUserModal,
  } from "components/database/ModelDataTable/modals"

  let selectedRecord

  async function selectRecord(record) {
    selectedRecord = await api.loadRecord(record.key, {
      appname: $store.appname,
      instanceId: $backendUiStore.selectedDatabase.id,
    })
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
