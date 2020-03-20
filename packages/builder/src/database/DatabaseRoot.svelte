<script>
  import ModelView from "./ModelView.svelte"
  import IndexView from "./IndexView.svelte"
  import ModelDataTable from "./ModelDataTable"
  import ActionsHeader from "./ActionsHeader.svelte"
  import { store, backendUiStore } from "../builderStore"
  import getIcon from "../common/icon"
  import DropdownButton from "../common/DropdownButton.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import Modal from "../common/Modal.svelte"
  import {
    CreateEditRecordModal,
    CreateEditModelModal,
    CreateEditViewModal,
    CreateDatabaseModal
  } from "./ModelDataTable/modals"

  let selectedRecord

  function selectRecord(record) {
    selectedRecord = record
    backendUiStore.actions.modals.show("RECORD")
  }

  function onClosed() {
    // backendUiStore.actions.modals.hide()
  }

  $: recordOpen = $backendUiStore.visibleModal === "RECORD"
  $: modelOpen = $backendUiStore.visibleModal === "MODEL"
  $: viewOpen = $backendUiStore.visibleModal === "VIEW"
  $: databaseOpen = $backendUiStore.visibleModal === "DATABASE"
  // $: recordOpen = $store.currentNode && $store.currentNode.type === 'record'
  // $: viewOpen = $store.currentNode && $store.currentNode.type === 'index'
</script>

({ console.log($backendUiStore.visibleModal) })

<CreateEditRecordModal modalOpen={recordOpen} record={selectedRecord} {onClosed} />
<CreateEditModelModal modalOpen={modelOpen} {onClosed} />
<CreateEditViewModal modalOpen={viewOpen} {onClosed} />
<CreateDatabaseModal modalOpen={databaseOpen} {onClosed} />


<div class="root">
  <div class="node-view">
    <div class="database-actions">
      <div class="budibase__label--big">
        {#if $backendUiStore.selectedDatabase.name}
          {$backendUiStore.selectedDatabase.name} / {$store.currentNode}
        {/if}
        </div>
      <ActionButton
        primary
        on:click={() => {
          selectedRecord = null
          backendUiStore.actions.modals.show("RECORD")
        }}>
        Create new record
      </ActionButton>
    </div>
    <ModelDataTable {selectRecord} />
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
