<script>
  import { onMount } from "svelte"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import api from "./api"
  import { capitalise } from "./helpers"

  export let schema = {}
  export let linkedRecords = []
  export let showLabel = true
  export let secondary

  let linkedTable

  $: label = capitalise(schema.name)
  $: linkedTableId = schema.tableId
  $: recordsPromise = fetchRecords(linkedTableId)
  $: fetchTable(linkedTableId)

  async function fetchTable() {
    if (linkedTableId == null) {
      return
    }
    const FETCH_TABLE_URL = `/api/tables/${linkedTableId}`
    const response = await api.get(FETCH_TABLE_URL)
    linkedTable = await response.json()
  }

  async function fetchRecords(linkedTableId) {
    if (linkedTableId == null) {
      return
    }
    const FETCH_RECORDS_URL = `/api/${linkedTableId}/records`
    const response = await api.get(FETCH_RECORDS_URL)
    return await response.json()
  }

  function getPrettyName(record) {
    return record[(linkedTable && linkedTable.primaryDisplay) || "_id"]
  }
</script>

{#if linkedTable != null}
  {#if linkedTable.primaryDisplay == null}
    {#if showLabel}
      <Label extraSmall grey>{label}</Label>
    {/if}
    <Label small black>
      Please choose a primary display column for the
      <b>{linkedTable.name}</b>
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
