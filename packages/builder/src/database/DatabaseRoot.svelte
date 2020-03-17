<script>
  import HierarchyRow from "./HierarchyRow.svelte"
  import ModelView from "./ModelView.svelte"
  import IndexView from "./IndexView.svelte"
  import ModelDataTable from "./ModelDataTable"
  import ActionsHeader from "./ActionsHeader.svelte"
  import { store } from "../builderStore"
  import getIcon from "../common/icon"
  import DropdownButton from "../common/DropdownButton.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import Modal from "../common/Modal.svelte"
  import {
    CreateEditRecordModal,
    CreateEditModelModal,
    CreateEditViewModal,
  } from "./ModelDataTable/modals"

  let modalOpen
  let selectedRecord

  function selectRecord(record) {
    selectedRecord = record
    modalOpen = true
  }

  $: recordOpen = $store.currentNode && $store.currentNode.type === 'record'
  $: viewOpen = $store.currentNode && $store.currentNode.type === 'index'
</script>

<CreateEditRecordModal bind:modalOpen record={selectedRecord} />
<CreateEditModelModal modalOpen={recordOpen} />
<CreateEditViewModal modalOpen={viewOpen} />

<div class="root">
  <div class="node-view">
    <div class="breadcrumbs">{$store.currentlySelectedDatabase}</div>
    <ActionButton
      primary
      on:click={() => {
        selectedRecord = null
        modalOpen = true
      }}>
      Create new record
    </ActionButton>
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
</style>
