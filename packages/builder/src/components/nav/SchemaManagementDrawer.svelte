<script>
  import { getContext, onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import HierarchyRow from "./HierarchyRow.svelte"
  import NavItem from "./NavItem.svelte"
  import getIcon from "components/common/icon"
  import api from "builderStore/api"
  import {
    CreateEditModelModal,
    CreateEditViewModal,
  } from "components/database/ModelDataTable/modals"

  const { open, close } = getContext("simple-modal")

  function editModel() {
    open(
      CreateEditModelModal,
      {
        model: node,
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  function newModel() {
    open(
      CreateEditModelModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  function newView() {
    open(
      CreateEditViewModal,
      {
        onClosed: close,
      },
      { styleContent: { padding: "0" } }
    )
  }

  function selectModel(model) {
    backendUiStore.update(state => {
      state.selectedModel = model
      state.selectedView = `all_${model._id}`
      return state
    })
  }


  async function deleteModel(modelToDelete) {
    const DELETE_MODEL_URL = `/api/${instanceId}/models/${node._id}/${node._rev}`
    const response = await api.delete(DELETE_MODEL_URL)
    backendUiStore.update(state => {
      state.models = state.models.filter(model => model._id !== modelToDelete._id)
      state.selectedView = {}
      return state
    })
  }

  function selectView(view) {
    backendUiStore.update(state => {
      state.selectedView = view.name
      return state
    })
  }
</script>

<div class="items-root">
  <div class="hierarchy">
    <div class="components-list-container">
      <div class="nav-group-header">
        <div class="hierarchy-title">Models</div>
        <div class="uk-inline">
          <i class="ri-add-line hoverable" on:click={newModel} />
        </div>
      </div>
    </div>

    <div class="hierarchy-items-container">
      {#each $backendUiStore.models as model}
        <HierarchyRow 
          onSelect={selectModel}
          node={model} 
          type="model" 
        />
      {/each}
    </div>
  </div>

  <div class="hierarchy">
    <div class="components-list-container">
      <div class="nav-group-header">
        <div class="hierarchy-title">Views</div>
        <div class="uk-inline">
          <i class="ri-add-line hoverable" on:click={newView} />
        </div>
      </div>
    </div>

    <div class="hierarchy-items-container">
      {#each $backendUiStore.views as view}
        <HierarchyRow 
          onSelect={selectView}
          node={view} 
          type="view" 
        />
      {/each}
    </div>
  </div>
</div>

<style>
  .items-root {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
    background-color: var(--white);
  }

  .nav-group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 10px 20px;
  }

  .hierarchy-title {
    align-items: center;
    text-transform: uppercase;
    font-size: 13px;
    font-weight: bold;
    opacity: 0.6;
    letter-spacing: 1px;
    text-rendering: optimizeLegibility;
  }

  .hierarchy {
    display: flex;
    flex-direction: column;
  }

  .hierarchy-items-container {
    flex: 1 1 auto;
    overflow-y: auto;
  }
</style>
