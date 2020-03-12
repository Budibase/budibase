<script>
  import HierarchyRow from "./HierarchyRow.svelte"
  import ModelView from "./ModelView.svelte"
  import IndexView from "./IndexView.svelte"
  import ModelDataTable from "./ModelDataTable"
  import ActionsHeader from "./ActionsHeader.svelte"
  import { store } from "../builderStore"
  import getIcon from "../common/icon"
  import DropdownButton from "../common/DropdownButton.svelte"
  import Modal from "../common/Modal.svelte"
  import { hierarchy as hierarchyFunctions } from "../../../core/src"

  const hierarchyWidth = "200px"

  const defaultNewIndexActions = [
    {
      label: "New Root Index",
      onclick: store.newRootIndex,
    },
  ]

  const defaultNewRecordActions = [
    {
      label: "New Root Record",
      onclick: store.newRootRecord,
    },
  ]

  let newIndexActions = defaultNewIndexActions
  let newRecordActions = defaultNewRecordActions

  store.subscribe(db => {
    if (!db.currentNode || hierarchyFunctions.isIndex(db.currentNode)) {
      newRecordActions = defaultNewRecordActions
      newIndexActions = defaultNewIndexActions
    } else {
      newRecordActions = [
        ...defaultNewRecordActions,
        {
          label: `New Child Record of ${db.currentNode.name}`,
          onclick: store.newChildRecord,
        },
      ]

      newIndexActions = [
        ...defaultNewIndexActions,
        {
          label: `New Index on ${db.currentNode.name}`,
          onclick: store.newChildIndex,
        },
      ]
    }
  })
</script>

<div class="root">
  <!-- <div class="actions-header">
    {#if $store.currentNode}
      <ActionsHeader />
    {/if}
  </div> -->
  <div class="node-view">
    <div class="breadcrumbs">{$store.currentlySelectedDatabase}</div>
    <ModelDataTable />
    {#if $store.currentNode}
      <Modal isOpen={$store.currentNode}>
        {#if $store.currentNode.type === 'record'}
          <ModelView />
          <ActionsHeader />
        {:else}
          <IndexView />
          <ActionsHeader />
        {/if}
      </Modal>
    {/if}
  </div>
</div>

<style>
  .root {
    height: 100%;
    position: relative;
  }

  .actions-header {
    flex: 0 1 auto;
  }

  .node-view {
    overflow-y: auto;
    flex: 1 1 auto;
  }
</style>
