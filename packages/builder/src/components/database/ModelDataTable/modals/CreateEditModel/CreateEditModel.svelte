<script>
  import { tick } from "svelte"
  import Textbox from "components/common/Textbox.svelte"
  import Button from "components/common/Button.svelte"
  import Select from "components/common/Select.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import getIcon from "components/common/icon"
  import FieldView from "./FieldView.svelte"
  import api from "builderStore/api"
  import { store, backendUiStore } from "builderStore"
  import { pipe } from "components/common/core"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let model = { schema: {} }
  export let onClosed

  let showFieldView = false
  let fieldToEdit

  $: modelFields = model.schema ? Object.entries(model.schema) : []
  $: instanceId = $backendUiStore.selectedDatabase._id

  function editField() {}

  function deleteField() {}

  function onFinishedFieldEdit() {}

  async function saveModel() {
    const SAVE_MODEL_URL = `/api/${instanceId}/models`
    const response = await api.post(SAVE_MODEL_URL, model)
    const newModel = await response.json()
    backendUiStore.actions.models.create(newModel)
    onClosed()
  }
</script>

<heading>
  {#if !showFieldView}
    <i class="ri-list-settings-line button--toggled" />
    <h3 class="budibase__title--3">Create / Edit Model</h3>
  {:else}
    <i class="ri-file-list-line button--toggled" />
    <h3 class="budibase__title--3">Create / Edit Field</h3>
  {/if}
</heading>
{#if !showFieldView}
  <div class="padding">
    <h4 class="budibase__label--big">Settings</h4>

    {#if $store.errors && $store.errors.length > 0}
      <ErrorsBox errors={$store.errors} />
    {/if}

    <Textbox label="Name" bind:text={model.name} />

    <div class="table-controls">
      <span class="budibase__label--big">Fields</span>
      <h4 class="hoverable new-field" on:click={() => (showFieldView = true)}>
        Add new field
      </h4>
    </div>

    <table class="uk-table fields-table budibase__table">
      <thead>
        <tr>
          <th>Edit</th>
          <th>Name</th>
          <th>Type</th>
          <th>Values</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each modelFields as [key, meta]}
          <tr>
            <td>
              <i class="ri-more-line" on:click={() => editField(meta)} />
            </td>
            <td>
              <div>{key}</div>
            </td>
            <td>{meta.type}</td>
            <td>
              <i
                class="ri-delete-bin-6-line hoverable"
                on:click={() => deleteField(meta)} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="uk-margin">
      <ActionButton color="secondary" on:click={saveModel}>Save</ActionButton>
    </div>
  </div>
{:else}
  <FieldView
    field={fieldToEdit}
    onFinished={onFinishedFieldEdit}
    schema={model.schema}
    goBack={() => (showFieldView = false)} />
{/if}

<style>
  .padding {
    padding: 20px;
  }

  .new-field {
    font-size: 16px;
    font-weight: bold;
    color: var(--button-text);
  }

  .fields-table {
    margin: 1rem 1rem 0rem 0rem;
    border-collapse: collapse;
  }

  tbody > tr:hover {
    background-color: var(--primary10);
  }

  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ri-more-line:hover {
    cursor: pointer;
  }

  heading {
    padding: 20px 20px 0 20px;
    display: flex;
    align-items: center;
  }

  h3 {
    margin: 0 0 0 10px;
  }
</style>
