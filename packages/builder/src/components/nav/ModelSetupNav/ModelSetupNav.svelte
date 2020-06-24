<script>
  import { getContext, onMount } from "svelte"
  import { Button, Switcher } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { store, backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import ModelFieldEditor from "./ModelFieldEditor.svelte"

  const { open, close } = getContext("simple-modal")

  const ITEMS = [
    {
      title: "Setup",
      key: "SETUP",
    },
    {
      title: "Delete",
      key: "DELETE",
    },
  ]

  let edited = false

  $: selectedTab = $backendUiStore.tabs.SETUP_PANEL

  $: edited =
    $backendUiStore.selectedField ||
    ($backendUiStore.draftModel &&
      $backendUiStore.draftModel.name !== $backendUiStore.selectedModel.name)

  async function deleteModel() {
    const model = $backendUiStore.selectedModel
    const field = $backendUiStore.selectedField

    if (field) {
      delete model.schema[field]
      backendUiStore.actions.models.save({ model })
      notifier.danger(`Field ${field} deleted.`)
      return
    }

    const DELETE_MODEL_URL = `/api/models/${model._id}/${model._rev}`
    const response = await api.delete(DELETE_MODEL_URL)
    backendUiStore.update(state => {
      state.selectedView = null
      state.selectedModel = {}
      state.draftModel = {}
      state.models = state.models.filter(({ _id }) => _id !== model._id)
      notifier.danger(`${model.name} deleted successfully.`)
      return state
    })
  }

  async function saveModel() {
    await backendUiStore.actions.models.save({
      model: $backendUiStore.draftModel,
    })
    notifier.success(
      "Success! Your changes have been saved. Please continue on with your greatness."
    )
  }
</script>

<div class="items-root">
  <Switcher headings={ITEMS} bind:value={$backendUiStore.tabs.SETUP_PANEL}>
    {#if selectedTab === 'SETUP'}
      {#if $backendUiStore.selectedField}
        <ModelFieldEditor />
      {:else if $backendUiStore.draftModel.schema}
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
      {/if}
      <footer>
        <Button disabled={!edited} attention={edited} wide on:click={saveModel}>
          Save
        </Button>
      </footer>
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

  footer {
    width: 100%;
    position: fixed;
    bottom: 20px;
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
    padding: 12px;
    background: var(--light-grey);
    margin-bottom: 5px;
  }

  .titled-input header {
    display: block;
    font-size: 14px;
    margin-bottom: 16px;
  }
</style>
