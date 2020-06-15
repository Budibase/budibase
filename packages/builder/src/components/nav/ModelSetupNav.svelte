<script>
  import { getContext, onMount } from "svelte"
  import { Button, Switcher } from "@budibase/bbui"
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

  const ITEMS = [
    {
      title: "Setup",
      key: "SETUP",
    },
    {
      title: "Filter",
      key: "FILTER",
    },
    {
      title: "Delete",
      key: "DELETE",
    },
  ]

  let selectedTab = "SETUP"
  let modelName = $backendUiStore.selectedModel.name
  let edited

  $: if (modelName) {
    edited = modelName !== $backendUiStore.selectedModel.name
  }

  async function deleteModel() {
    const modelToDelete = $backendUiStore.selectedModel
    const DELETE_MODEL_URL = `/api/${instanceId}/models/${modelToDelete._id}/${modelToDelete._rev}`
    const response = await api.delete(DELETE_MODEL_URL)
    backendUiStore.update(state => {
      state.models = state.models.filter(
        model => model._id !== modelToDelete._id
      )
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
  <Switcher headings={ITEMS} bind:value={selectedTab}>
    {#if selectedTab === 'SETUP'}
      <div class="titled-input">
        <header>Name</header>
        <input type="text" class="budibase__input" bind:value={modelName} />
      </div>
      <div class="titled-input">
        <header>Import Data</header>
        <Button wide secondary>Import CSV</Button>
      </div>

      <Button
        disabled={!edited}
        attention={edited}
        wide
        on:click={() => alert('Clicked!')}>
        Save
      </Button>
    {:else if selectedTab === 'DELETE'}
      <div class="titled-input">
        <header>Danger Zone</header>
        <Button error wide on:click={deleteModel}>
          Delete
        </Button>
      </div>
    {/if}
  </Switcher>
</div>

<style>
  .items-root {
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
    background-color: var(--white);
  }

  .titled-input {
    padding: 20px;
    background: var(--light-grey);
    margin-top: 20px;
  }

  .titled-input header {
    display: block;
    font-size: 14px;
    margin-bottom: 16px;
  }
</style>
