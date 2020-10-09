<script>
  import { onMount } from "svelte"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import api from "./api"
  import { capitalise } from "./helpers"

  export let schema = {}
  export let linkedRows = []
  export let showLabel = true
  export let secondary

  let linkedTable

  $: label = capitalise(schema.name)
  $: linkedTableId = schema.tableId
  $: rowsPromise = fetchRows(linkedTableId)
  $: fetchTable(linkedTableId)

  async function fetchTable() {
    if (linkedTableId == null) {
      return
    }
    const FETCH_TABLE_URL = `/api/tables/${linkedTableId}`
    const response = await api.get(FETCH_TABLE_URL)
    linkedTable = await response.json()
  }

  async function fetchRows(linkedTableId) {
    if (linkedTableId == null) {
      return
    }
    const FETCH_ROWS_URL = `/api/${linkedTableId}/rows`
    const response = await api.get(FETCH_ROWS_URL)
    return await response.json()
  }

  function getPrettyName(row) {
    return row[(linkedTable && linkedTable.primaryDisplay) || "_id"]
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
    {#await rowsPromise then rows}
      <Multiselect
        {secondary}
        bind:value={linkedRows}
        label={showLabel ? label : null}
        placeholder="Choose some options">
        {#each rows as row}
          <option value={row._id}>{getPrettyName(row)}</option>
        {/each}
      </Multiselect>
    {/await}
  {/if}
{/if}
