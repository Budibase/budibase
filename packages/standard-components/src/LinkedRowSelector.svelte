<script>
  import { Label, Multiselect } from "@budibase/bbui"
  import api from "./api"
  import { capitalise } from "./helpers"

  export let schema = {}
  export let linkedRows = []
  export let showLabel = true
  export let secondary

  let linkedTable
  let allRows = []

  $: label = capitalise(schema.name)
  $: linkedTableId = schema.tableId
  $: fetchRows(linkedTableId)
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
    allRows = await response.json()
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
      Please choose a display column for the
      <b>{linkedTable.name}</b>
      table.
    </Label>
  {:else}
    <Multiselect
      {secondary}
      bind:value={linkedRows}
      label={showLabel ? label : null}
      placeholder="Choose some options">
      {#each allRows as row}
        <option value={row._id}>{getPrettyName(row)}</option>
      {/each}
    </Multiselect>
  {/if}
{/if}
