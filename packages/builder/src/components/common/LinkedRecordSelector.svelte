<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import { capitalise } from "../../helpers"

  export let schema
  export let linkedRecords = []

  let records = []

  $: label = capitalise(schema.name)
  $: linkedModelId = schema.modelId
  $: linkedModel = $backendUiStore.models.find(
    model => model._id === linkedModelId
  )
  $: fetchRecords(linkedModelId)

  async function fetchRecords(linkedModelId) {
    const FETCH_RECORDS_URL = `/api/${linkedModelId}/records`
    try {
      const response = await api.get(FETCH_RECORDS_URL)
      records = await response.json()
    } catch (error) {
      console.log(error)
      records = []
    }
  }

  function getPrettyName(record) {
    return record[linkedModel.primaryDisplay || "_id"]
  }
</script>

{#if linkedModel.primaryDisplay == null}
  <Label extraSmall grey>{label}</Label>
  <Label small black>
    Please choose a primary display column for the
    <b>{linkedModel.name}</b>
    table.
  </Label>
{:else}
  <Multiselect
    secondary
    bind:value={linkedRecords}
    {label}
    placeholder="Choose some options">
    {#each records as record}
      <option value={record._id}>{getPrettyName(record)}</option>
    {/each}
  </Multiselect>
{/if}
