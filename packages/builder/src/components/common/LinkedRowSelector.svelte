<script>
  import { tables } from 'stores/backend/'
  import api from "builderStore/api"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import { capitalise } from "../../helpers"

  export let schema
  export let linkedRows = []

  let rows = []
  let linkedIds = (linkedRows || [])?.map(row => row?._id || row)

  $: linkedRows = linkedIds
  $: label = capitalise(schema.name)
  $: linkedTableId = schema.tableId
  $: linkedTable = $tables.list.find(
    table => table._id === linkedTableId
  )
  $: fetchRows(linkedTableId)

  async function fetchRows(linkedTableId) {
    const FETCH_ROWS_URL = `/api/${linkedTableId}/rows`
    try {
      const response = await api.get(FETCH_ROWS_URL)
      rows = await response.json()
    } catch (error) {
      console.log(error)
      rows = []
    }
  }

  function getPrettyName(row) {
    return row[linkedTable.primaryDisplay || "_id"]
  }
</script>

{#if linkedTable.primaryDisplay == null}
  <Label extraSmall grey>{label}</Label>
  <Label small black>
    Please choose a display column for the
    <b>{linkedTable.name}</b>
    table.
  </Label>
{:else}
  {#if schema.relationshipType === 'one-to-many'}
    <Select
      thin
      secondary
      on:change={e => (linkedIds = e.target.value ? [e.target.value] : [])}
      name={label}
      {label}>
      <option value="">Choose an option</option>
      {#each rows as row}
        <option selected={row._id === linkedIds[0]} value={row._id}>
          {getPrettyName(row)}
        </option>
      {/each}
    </Select>
  {:else}
    <Multiselect
      secondary
      bind:value={linkedIds}
      {label}
      placeholder="Choose some options">
      {#each rows as row}
        <option value={row._id}>{getPrettyName(row)}</option>
      {/each}
    </Multiselect>
  {/if}
{/if}
