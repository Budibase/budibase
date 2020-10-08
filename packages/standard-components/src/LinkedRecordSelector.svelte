<script>
  import { onMount } from "svelte"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import api from "./api"
  import { capitalise } from "./helpers"

  export let schema = {}
  export let linkedRecords = []
  export let showLabel = true
  export let secondary

  let linkedModel

  $: label = capitalise(schema.name)
  $: linkedModelId = schema.modelId
  $: recordsPromise = fetchRecords(linkedModelId)
  $: fetchModel(linkedModelId)

  async function fetchModel() {
    if (linkedModelId == null) {
      return
    }
    const FETCH_MODEL_URL = `/api/models/${linkedModelId}`
    const response = await api.get(FETCH_MODEL_URL)
    linkedModel = await response.json()
  }

  async function fetchRecords(linkedModelId) {
    if (linkedModelId == null) {
      return
    }
    const FETCH_RECORDS_URL = `/api/${linkedModelId}/records`
    const response = await api.get(FETCH_RECORDS_URL)
    return await response.json()
  }

  function getPrettyName(record) {
    return record[(linkedModel && linkedModel.primaryDisplay) || "_id"]
  }
</script>

{#if linkedModel != null}
  {#if linkedModel.primaryDisplay == null}
    {#if showLabel}
      <Label extraSmall grey>{label}</Label>
    {/if}
    <Label small black>
      Please choose a primary display column for the
      <b>{linkedModel.name}</b>
      table.
    </Label>
  {:else}
    {#await recordsPromise then records}
      <Multiselect
        {secondary}
        bind:value={linkedRecords}
        label={showLabel ? label : null}
        placeholder="Choose some options">
        {#each records as record}
          <option value={record._id}>{getPrettyName(record)}</option>
        {/each}
      </Multiselect>
    {/await}
  {/if}
{/if}
