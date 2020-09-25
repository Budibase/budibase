<script>
  import { onMount, tick } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { compose, map, get, flatten } from "lodash/fp"
  import { Input, TextArea, Button } from "@budibase/bbui"
  import LinkedRecordSelector from "components/common/LinkedRecordSelector.svelte"
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

    onClosed()
    notifier.success("Record saved successfully.")
    backendUiStore.actions.records.save(recordResponse)
  }
</script>

<div class="container">
  <ErrorsBox {errors} />
  <form on:submit|preventDefault>
    {#each modelSchema as [key, meta]}
      <div>
        {#if meta.type === 'link'}
          <LinkedRecordSelector
            bind:linked={record[key]}
            linkName={meta.name}
            modelId={meta.modelId} />
        {:else}
          <RecordFieldControl {meta} bind:value={record[key]} />
        {/if}
      </div>
    {/each}
  </form>
  <footer>
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={saveRecord}>Save</Button>
  </footer>
</div>

<style>
  .container {
    padding: var(--spacing-xl);
    display: grid;
    grid-gap: var(--spacing-xl);
    min-width: 400px;
  }

  form {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
