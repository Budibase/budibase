<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "../../../builderStore"
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import Select from "../../../common/Select.svelte"
  import { getNewRecord } from "../../../common/core"
  import * as api from "../api"

  export let modalOpen = false
  export let record
  export let onClosed

  let selectedModel

  $: currentAppInfo = {
    instanceId: $store.currentInstanceId,
    appname: $store.appname,
  }
  $: recordFields = record ? Object.keys(record) : []
  $: models = $store.hierarchy.children
  $: modelFields = selectedModel
    ? selectedModel.fields.map(({ name }) => name)
    : []
  
</script>

<Modal {onClosed} isOpen={modalOpen}>
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
    <div class="actions">
      <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
      <ActionButton
        disabled={false}
        on:click={async () => {
          const recordResponse = await api.saveRecord(record || selectedModel, currentAppInfo)
          backendUiStore.update(state => {
            state.selectedView.records.push(recordResponse)
            return state
          })
          onClosed()
        }}>
        Save
      </ActionButton>
    </div>
  </div>
</Modal>

<style>
  .actions {
    position: absolute;
  }
</style>
