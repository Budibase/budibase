<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Select, Label } from "@budibase/bbui"
  import { capitalise } from "../../helpers"

  export let schema
  export let linkedRecords = []

  let records = []

  $: label = capitalise(schema.name)
  $: linkedModelId = schema.modelId
  $: linkedModel = $backendUiStore.models.find(
    model => model._id === linkedModelId
  )

  async function fetchRecords() {
    const FETCH_RECORDS_URL = `/api/${linkedModelId}/records`
    const response = await api.get(FETCH_RECORDS_URL)
    records = await response.json()
  }

  function getPrettyName(record) {
    return record[linkedModel.primaryDisplay || "_id"]
  }

  onMount(() => {
    fetchRecords()
  })
</script>

{#if linkedModel.primaryDisplay == null}
  <Label extraSmall grey>{label}</Label>
  <Label small black>
    Please choose a primary display column for the
    <b>{linkedModel.name}</b>
    table.
  </Label>
{:else}
  <Select thin secondary bind:value={linkedRecords[0]} {label}>
    <option value="">Choose an option</option>
    {#each records as record}
      <option value={record._id}>{getPrettyName(record)}</option>
    {/each}
  </Select>
{/if}
