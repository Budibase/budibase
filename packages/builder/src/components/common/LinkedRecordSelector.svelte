<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Select, Label } from "@budibase/bbui"
  import { capitalise } from "../../helpers"
  import MultiSelect from "components/common/MultiSelect.svelte"

  export let schema
  export let linkedRecords = []

  $: label = capitalise(schema.name)
  $: linkedModelId = schema.modelId
  $: linkedModel = $backendUiStore.models.find(
    model => model._id === linkedModelId
  )
  $: promise = fetchRecords(linkedModelId)

  async function fetchRecords(linkedModelId) {
    const FETCH_RECORDS_URL = `/api/${linkedModelId}/records`
    const response = await api.get(FETCH_RECORDS_URL)
    const result = await response.json()
    console.log(result)
    return result
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
  {#await promise then records}
    <MultiSelect
      thin
      secondary
      bind:value={linkedRecords}
      {label}
      placeholder="Choose an option">
      {#each records as record}
        <option value={record._id}>{getPrettyName(record)}</option>
      {/each}
    </MultiSelect>
  {/await}
{/if}
