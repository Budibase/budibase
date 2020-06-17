<script>
  import { getContext, onMount } from "svelte"
  import { Button, Switcher } from "@budibase/bbui"
  import { notifier } from "@beyonk/svelte-notifications"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import FieldView from "./FieldView.svelte";

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

  $: edited = $backendUiStore.draftModel.name !== $backendUiStore.selectedModel.name

  async function deleteModel() {
    const modelToDelete = $backendUiStore.selectedModel
    if ($backendUiStore.selectedField) {
      delete modelToDelete[$backendUiStore.selectedField]
    }

    const DELETE_MODEL_URL = `/api/${$backendUiStore.selectedDatabase._id}/models/${modelToDelete._id}/${modelToDelete._rev}`
    const response = await api.delete(DELETE_MODEL_URL)
    backendUiStore.update(state => {
      state.selectedView = null
      state.models = state.models.filter(
        model => model._id !== modelToDelete._id
      )
      notifier.danger(`${modelToDelete.name} deleted successfully.`)
      return state
    })
  }

  async function saveModel() {
    await backendUiStore.actions.models.save({ 
      instanceId: $backendUiStore.selectedDatabase._id,
      model: $backendUiStore.draftModel
    })
    notifier.success("Success! Your changes have been saved. Please continue on with your greatness.");
  }
</script>

<div class="items-root">
  <Switcher headings={ITEMS} bind:value={selectedTab}>
    {#if selectedTab === 'SETUP'}
      {#if $backendUiStore.selectedField}
        <FieldView />
      {:else}
        <div class="titled-input">
          <header>Name</header>
          <input
            type="text"
            class="budibase__input"
            bind:value={$backendUiStore.draftModel.name} />
        </div>
        <div class="titled-input">
          <header>Import Data</header>
          <Button wide secondary>Import CSV</Button>
        </div>
        <Button
          attention
          wide
          on:click={saveModel}>
          Save
        </Button>
      {/if}
    {:else if selectedTab === 'DELETE'}
      <div class="titled-input">
        <header>Danger Zone</header>
        <Button error wide on:click={deleteModel}>Delete</Button>
      </div>
    {/if}
  </Switcher>
</div>

<style>
  header {
    font-weight: 500;
  }

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
