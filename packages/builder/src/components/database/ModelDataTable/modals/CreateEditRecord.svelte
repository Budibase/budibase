<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { notifier } from "@beyonk/svelte-notifications"
  import { compose, map, get, flatten } from "lodash/fp"
  import { Button } from "@budibase/bbui"
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

  function closed() {
    onClosed()
  }

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
  <header>
    <i class="ri-file-user-fill" />
    <h4 class="budibase__title--4">Create / Edit Record</h4>
  </header>
  <ErrorsBox {errors} />
  <form on:submit|preventDefault class="uk-form-stacked">
    {#each modelSchema as [key, meta]}
      <div class="uk-margin">
        {#if meta.type === 'link'}
          <LinkedRecordSelector
            bind:linked={record[key]}
            linkName={key}
            modelId={meta.modelId} />
        {:else}
          <RecordFieldControl
            type={determineInputType(meta)}
            options={determineOptions(meta)}
            label={key}
            bind:value={record[key]} />
        {/if}
      </div>
    {/each}
  </form>
</div>
<footer>
  <Button secondary on:click={onClosed}>Cancel</Button>
  <Button attention on:click={saveRecord}>Save</Button>
</footer>

<style>
  header {
    margin-bottom: 40px;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: 40px 1fr;
    align-items: center;
  }

  i {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary);
    color: var(--ink);
    font-size: 20px;
    margin-right: 20px;
    border-radius: 3px;
  }

  h4 {
    display: inline-block;
    font-size: 24px;
    font-weight: bold;
    color: var(--ink);
    margin: 0;
  }

  .actions {
    padding: 30px;
  }

  footer {
    padding: 20px;
    background: #fafafa;
    border-radius: 0.5rem;
  }
</style>
