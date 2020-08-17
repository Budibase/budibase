<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { compose, map, get, flatten } from "lodash/fp"
  import { Input, TextArea, Button } from "@budibase/bbui"
  import LinkedRecordSelector from "components/common/LinkedRecordSelector.svelte"
  import Select from "components/common/Select.svelte"
  import RecordFieldControl from "./RecordFieldControl.svelte"
  import * as api from "../api"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let record = {}
  export let onClosed

  let errors = []
  let selectedModel

  $: modelSchema = $backendUiStore.selectedModel
    ? Object.entries($backendUiStore.selectedModel.schema)
    : []

  const isSelect = meta =>
    meta.type === "string" &&
    meta.constraints &&
    meta.constraints.inclusion &&
    meta.constraints.inclusion.length > 0

  function determineInputType(meta) {
    if (meta.type === "datetime") return "date"
    if (meta.type === "number") return "number"
    if (meta.type === "boolean") return "checkbox"
    if (isSelect(meta)) return "select"

    return "text"
  }

  function determineOptions(meta) {
    return isSelect(meta) ? meta.constraints.inclusion : []
  }

  async function saveRecord() {
    const recordResponse = await api.saveRecord(
      {
        ...record,
        modelId: $backendUiStore.selectedModel._id,
      },
      $backendUiStore.selectedModel._id
    )
    if (recordResponse.errors) {
      errors = Object.keys(recordResponse.errors)
        .map(k => ({ dataPath: k, message: recordResponse.errors[k] }))
        .flat()
      return
    }

    backendUiStore.update(state => {
      state.selectedView = state.selectedView
      onClosed()
      notifier.success("Record created successfully.")
      return state
    })
  }
</script>

<div class="actions">
  <ErrorsBox {errors} />
  <form on:submit|preventDefault class="uk-form-stacked">
    {#each modelSchema as [key, meta]}
      <div class="uk-margin">
        {#if meta.type === 'link'}
          <LinkedRecordSelector
            bind:linked={record[key]}
            linkName={meta.name}
            modelId={meta.modelId} />
        {:else}
          <RecordFieldControl
            type={determineInputType(meta)}
            options={determineOptions(meta)}
            label={meta.name}
            bind:value={record[key]} />
        {/if}
      </div>
    {/each}
  </form>
</div>
<footer>
  <div class="button-margin-3">
    <Button secondary on:click={onClosed}>Cancel</Button>
  </div>
  <div class="button-margin-4">
    <Button primary on:click={saveRecord}>Save</Button>
  </div>
</footer>

<style>
  .actions {
    padding: var(--spacing-l) var(--spacing-xl);
  }

  footer {
    padding: 20px 30px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    background: var(--grey-1);
    border-bottom-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
  }

  .button-margin-3 {
    grid-column-start: 3;
    display: grid;
  }

  .button-margin-4 {
    grid-column-start: 4;
    display: grid;
  }
</style>
