<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { compose, map, get, flatten } from "lodash/fp"
  import Modal from "components/common/Modal.svelte"
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

  export let record
  export let onClosed

  let errors = []

  const childModelsForModel = compose(flatten, map("children"), get("children"))

  $: currentAppInfo = {
    appname: $store.appname,
    instanceId: $backendUiStore.selectedDatabase.id,
  }
  $: models = $backendUiStore.selectedRecord
    ? childModelsForModel($store.hierarchy)
    : $store.hierarchy.children

  let selectedModel
  $: {
    if (record) {
      selectedModel = getExactNodeForKey($store.hierarchy)(record.key)
    } else {
      selectedModel = selectedModel || models[0]
    }
  }

  $: modelFields = selectedModel ? selectedModel.fields : []

  function getCurrentCollectionKey(selectedRecord) {
    return selectedRecord
      ? joinKey(selectedRecord.key, selectedModel.collectionName)
      : joinKey(selectedModel.collectionName)
  }

  $: editingRecord =
    record ||
    editingRecord ||
    getNewRecord(
      selectedModel,
      getCurrentCollectionKey($backendUiStore.selectedRecord)
    )

  function closed() {
    editingRecord = null
    onClosed()
  }

  async function saveRecord() {
    const recordResponse = await api.saveRecord(editingRecord, currentAppInfo)
    backendUiStore.update(state => {
      state.selectedView = state.selectedView
      return state
    })
    closed()
  }
</script>

<div>
  <h4 class="budibase__title--4">Create / Edit Record</h4>
  <ErrorsBox {errors} />
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
      {#each modelFields || [] as field}
        <RecordFieldControl record={editingRecord} {field} {errors} />
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
