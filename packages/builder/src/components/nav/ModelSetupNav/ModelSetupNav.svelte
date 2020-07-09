<script>
  import { getContext, onMount } from "svelte"
  import { Button, Switcher } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { store, backendUiStore, tourStore } from "builderStore"
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
      const name = model.schema[field].name
      delete model.schema[field]
      backendUiStore.actions.models.save({ model })
      notifier.danger(`Field ${name} deleted.`)
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

  function validate() {
    let errors = []
    for (let field of Object.values($backendUiStore.draftModel.schema)) {
      const restrictedFieldNames = ["type", "modelId"]
      if (field.name.startsWith("_")) {
        errors.push(`field '${field.name}' - name cannot begin with '_''`)
      } else if (restrictedFieldNames.includes(field.name)) {
        errors.push(
          `field '${field.name}' - is a restricted name, please rename`
        )
      } else if (!field.name || !field.name.trim()) {
        errors.push("field name cannot be blank")
      }
    }

    if (!$backendUiStore.draftModel.name) {
      errors.push("Table name cannot be blank")
    }

    return errors
  }

  async function saveModel() {
    const errors = validate()
    if (errors.length > 0) {
      notifier.danger(errors.join("/n"))
      return
    }

    await backendUiStore.actions.models.save({
      model: $backendUiStore.draftModel,
    })
    notifier.success(
      "Success! Your changes have been saved. Please continue on with your greatness."
    )

    setTimeout(() => {
      $tourStore.tour.next()
    }, 500)
  }
</script>

<div class="items-root">
  <Switcher headings={ITEMS} bind:value={$backendUiStore.tabs.SETUP_PANEL}>
    {#if selectedTab === 'SETUP'}
      {#if $backendUiStore.selectedField}
        <ModelFieldEditor />
      {:else if $backendUiStore.draftModel.schema}
        <div class="titled-input" id="shep-setup-tab">
          <header>Name</header>
          <input
            type="text"
            class="budibase__input"
            on:blur={$tourStore.tour.next}
            bind:value={$backendUiStore.draftModel.name} />
        </div>
        <div class="titled-input">
          <header>Import Data</header>
          <Button wide secondary>Import CSV</Button>
        </div>
      {/if}
      <footer id="shep-setup-save">
        <Button disabled={!edited} green={edited} wide on:click={saveModel}>
          Save
        </Button>
      </footer>
    {:else if selectedTab === 'DELETE'}
      <div class="titled-input">
        <header>Danger Zone</header>
        <Button red wide on:click={deleteModel}>Delete</Button>
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
    margin-bottom: 16px;
    display: grid;
  }

  .titled-input header {
    display: block;
    font-size: 14px;
    margin-bottom: 8px;
  }
</style>
