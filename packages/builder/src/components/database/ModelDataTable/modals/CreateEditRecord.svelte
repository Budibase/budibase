<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { compose, map, get, flatten } from "lodash/fp"
  import ActionButton from "components/common/ActionButton.svelte"
  import Select from "components/common/Select.svelte"
  import {
    getNewRecord,
    joinKey,
    getExactNodeForKey,
  } from "components/common/core"
  import RecordFieldControl from "./RecordFieldControl.svelte"
  import * as api from "../api"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let record = {}
  export let onClosed

  let errors = []
  let selectedModel

  $: instanceId = $backendUiStore.selectedDatabase.id

  $: models = $backendUiStore.selectedRecord
    ? childModelsForModel($store.hierarchy)
    : $store.hierarchy.children

  $: modelSchema = $backendUiStore.selectedModel
    ? Object.entries($backendUiStore.selectedModel.schema)
    : []

  function closed() {
    // editingRecord = null
    onClosed()
  }

  function determineInputType(meta) {
    if (meta.type === "datetime") return "date"
    if (meta.type === "number") return "number"
    if (meta.type === "boolean") return "checkbox"

    return "text"
  }

  async function saveRecord() {
    const recordResponse = await api.saveRecord(
      {
        ...record,
        modelId: $backendUiStore.selectedModel._id,
      },
      instanceId
    )
    if (recordResponse.errors) {
      errors = recordResponse.errors
      return
    }

    backendUiStore.update(state => {
      state.selectedView = state.selectedView
      return state
      onClosed();
    })
  }
</script>

<div class="actions">
  <h4 class="budibase__title--4">Create / Edit Record</h4>
  <!-- <ErrorsBox {errors} /> -->
  {JSON.stringify(errors)}
  <form on:submit|preventDefault class="uk-form-stacked">
    {#if !record}
      <div class="uk-margin">
        <label class="uk-form-label" for="form-stacked-text">Model</label>
        <Select bind:value={selectedModel}>
          {#each models as model}
            <option value={model}>{model.name}</option>
          {/each}
        </Select>
      </div>
    {/if}
    {#each modelSchema as [key, meta]}
      <div class="uk-margin">
        <RecordFieldControl
          {errors}
          type={determineInputType(meta)}
          label={key}
          bind:value={record[key]} />
      </div>
    {/each}
  </form>
</div>
<footer>
  <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
  <ActionButton on:click={saveRecord}>Save</ActionButton>
</footer>

<style>
  .actions {
    padding: 30px;
  }
  footer {
    padding: 20px;
    background: #fafafa;
    border-radius: 0.5rem;
  }
</style>
