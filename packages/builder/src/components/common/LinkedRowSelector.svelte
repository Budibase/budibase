<script>
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"
  import api from "builderStore/api"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import { capitalise } from "../../helpers"

  export let schema
  export let linkedRows = []

  console.log(schema)
  console.log(linkedRows)
  let rows = []

  $: label = capitalise(schema.name)
  $: linkedTableId = schema.tableId
  $: linkedTable = $backendUiStore.tables.find(
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

  let oneToManyRow = getPrettyName(linkedRows[0]) || ''

  function oneToManyValueSetter(value) {
    linkedRows = [value]
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
  {#if schema.oneToMany}
    <Select on:change={e => oneToManyValueSetter(e.target.value)} value={getPrettyName(oneToManyRow)} name="Test" label="Flavour">
      <option value="">Choose an option</option>
      {#each rows as row}
        <option value={row._id}>{getPrettyName(row)}</option>
      {/each}
    </Select>
  {:else}
    <Multiselect
      secondary
      bind:value={linkedRows}
      {label}
      placeholder="Choose some options">
      {#each rows as row}
        <option value={row._id}>{getPrettyName(row)}</option>
      {/each}
    </Multiselect>
  {/if}
{/if}
