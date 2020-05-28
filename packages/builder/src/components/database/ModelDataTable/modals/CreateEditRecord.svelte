<script>
  import { onMount } from "svelte"
  import { store, backendUiStore } from "builderStore"
  import { compose, map, get, flatten } from "lodash/fp"
  import ActionButton from "components/common/ActionButton.svelte"
  import Select from "components/common/Select.svelte"
  import RecordFieldControl from "./RecordFieldControl.svelte"
  import * as api from "../api"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  const CLASS_NAME_MAP = {
    boolean: "uk-checkbox",
  }

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
      instanceId,
      $backendUiStore.selectedModel._id
    )
    if (recordResponse.errors) {
      errors = recordResponse.errors
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
          className={CLASS_NAME_MAP[meta.type]}
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
