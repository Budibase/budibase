<script>
  import { getContext } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import * as api from "components/database/ModelDataTable/api"

  import BackendNav from "components/nav/BackendNav.svelte"
  import SchemaManagementDrawer from "components/nav/SchemaManagementDrawer.svelte"
  import Modal from "components/common/Modal.svelte"
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

  $: modelOpen = $backendUiStore.visibleModal === "MODEL"
  $: viewOpen = $backendUiStore.visibleModal === "VIEW"
</script>

<!-- <Modal isOpen={!!$backendUiStore.visibleModal} {onClosed}>
  {#if modelOpen}
    <CreateEditModelModal {onClosed} />
  {/if}
  {#if viewOpen}
    <CreateEditViewModal {onClosed} />
  {/if}
</Modal> -->

<div class="root">
  <div class="nav">
    <BackendNav />
  </div>
  <div class="content">
    <slot />
  </div>
  <div class="nav">
    <SchemaManagementDrawer />
  </div>
</div>

<style>
  .root {
    height: 100%;
    display: flex;
    background: #fafafa;
  }

  .content {
    flex: 1 1 auto;
    margin: 20px 40px;
  }

  .nav {
    overflow: auto;
    flex: 0 1 auto;
    width: 275px;
    height: 100%;
  }
</style>
