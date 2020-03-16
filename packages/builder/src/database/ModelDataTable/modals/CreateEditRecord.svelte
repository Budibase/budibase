<script>
  import { onMount } from "svelte"
  import { store } from "../../../builderStore"
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import Select from "../../../common/Select.svelte"
  import * as api from "../api"

  export let modalOpen = false
  export let record

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

  const onClosed = () => (modalOpen = false)
</script>

<Modal {onClosed} isOpen={modalOpen}>
  <h4 class="budibase__title--4">Create / Edit Record</h4>
  <div class="actions">
    {console.log('record', record)}
    {console.log('selectedModel', selectedModel)}
    {console.log('recordFields', recordFields)}
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
        on:click={() => api.saveRecord(record || selectedModel, currentAppInfo)}>
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
