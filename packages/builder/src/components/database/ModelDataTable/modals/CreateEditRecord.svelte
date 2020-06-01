<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { compose, map, get, flatten } from "lodash/fp"
  import ActionButton from "components/common/ActionButton.svelte"
  import Select from "components/common/Select.svelte"
  import RecordFieldControl from "./RecordFieldControl.svelte"
  import * as api from "../api"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  export let record = {}
  export let onClosed

  let errors = []
  let selectedModel

  $: instanceId = $backendUiStore.selectedDatabase._id

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
      instanceId,
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
      return state
    })
  }
</script>

<div class="actions">
  <h4 class="budibase__title--4">Create / Edit Record</h4>
  <ErrorsBox {errors} />
  <form on:submit|preventDefault class="uk-form-stacked">
    {#each modelSchema as [key, meta]}
      <div class="uk-margin">
        <RecordFieldControl
          type={determineInputType(meta)}
          options={determineOptions(meta)}
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
