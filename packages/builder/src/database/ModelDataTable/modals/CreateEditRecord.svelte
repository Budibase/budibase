<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "../../../builderStore"
  import { compose, map, get, flatten } from "lodash/fp"
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import Select from "../../../common/Select.svelte"
  import { getNewRecord } from "../../../common/core"
  import * as api from "../api"

  export let record
  export let onClosed

  let selectedModel

  const childModelsForModel = compose(
    flatten,
    map("children"),
    get("children")
  )

  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $backendUiStore.selectedDatabase.id,
  }
  $: recordFields = record ? Object.keys(record) : []
  $: models = $backendUiStore.selectedRecord
    ? childModelsForModel($store.hierarchy)
    : $store.hierarchy.children
  $: modelFields = selectedModel
    ? selectedModel.fields.map(({ name }) => name)
    : []

  async function saveRecord() {
    const recordResponse = await api.saveRecord(
      record || selectedModel,
      currentAppInfo
    )
    backendUiStore.update(state => {
      state.selectedView = state.selectedView
      return state
    })
    onClosed()
  }
</script>

<div>
  <h4 class="budibase__title--4">Create / Edit Record</h4>
  <div class="actions">
    <form class="uk-form-stacked">
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
      {#each modelFields as field}
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">{field}</label>
          <div class="uk-form-controls">
            <input
              class="uk-input"
              id="form-stacked-text"
              type="text"
              bind:value={selectedModel[field]} />
          </div>
        </div>
      {/each}
      {#each recordFields as field}
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">{field}</label>
          <div class="uk-form-controls">
            <input
              class="uk-input"
              id="form-stacked-text"
              type="text"
              bind:value={record[field]} />
          </div>
        </div>
      {/each}
    </form>
    <footer>
      <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
      <ActionButton on:click={saveRecord}>Save</ActionButton>
    </footer>
  </div>
</div>

<style>
  footer {
    position: absolute;
    padding: 20px;
    width: 100%;
    bottom: 0;
    left: 0;
    background: #fafafa;
  }
</style>
