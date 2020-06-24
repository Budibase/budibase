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

  function editField() {}

  function deleteField() {}

  function onFinishedFieldEdit() {}

  async function saveModel() {
    const SAVE_MODEL_URL = `/api/models`
    const response = await api.post(SAVE_MODEL_URL, model)
    const newModel = await response.json()
    backendUiStore.actions.models.create(newModel)
    onClosed()
  }
</script>

<div class="heading">
  {#if !showFieldView}
    <i class="ri-list-settings-line button--toggled" />
    <h3 class="budibase__title--3">Create / Edit Model</h3>
  {:else}
    <i class="ri-file-list-line button--toggled" />
    <h3 class="budibase__title--3">Create / Edit Field</h3>
  {/if}
</div>
{#if !showFieldView}
  <div class="padding">
    {#if $store.errors && $store.errors.length > 0}
      <ErrorsBox errors={$store.errors} />
    {/if}
    <div class="textbox">
      <Textbox label="Name" bind:text={model.name} />
    </div>
    <div class="table-controls">
      <span class="label">Fields</span>
      <div
        data-cy="add-new-model-field"
        class="hoverable new-field"
        on:click={() => (showFieldView = true)}>
        Add new field
      </div>
    </div>

    <table class="uk-table fields-table budibase__table">
      <thead>
        <tr>
          <th>Edit</th>
          <th>Name</th>
          <th>Type</th>
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
    <footer>
      <ActionButton color="secondary" on:click={saveModel}>Save</ActionButton>
    </footer>
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
    padding-top: 40px;
  }

  .label {
    font-size: 14px;
    font-weight: 500;
  }

  .textbox {
    margin: 0px 40px 0px 40px;
    font-size: 14px;
    font-weight: 500;
  }

  .new-field {
    font-size: 16px;
    font-weight: bold;
    color: var(--blue);
  }

  .fields-table {
    margin: 8px 40px 0px 40px;
    border-collapse: collapse;
    width: 88%;
  }

  tbody > tr:hover {
    background-color: var(--grey-1);
  }

  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px 40px;
  }

  .ri-more-line:hover {
    cursor: pointer;
  }

  .heading {
    padding: 40px 40px 0 40px;
    display: flex;
    align-items: center;
  }

  h3 {
    margin: 0 0 0 10px;
    color: var(--ink);
  }

  footer {
    background-color: var(--grey-1);
    margin-top: 40px;
    padding: 20px 40px 20px 40px;
    display: flex;
    justify-content: flex-end;
  }
</style>
