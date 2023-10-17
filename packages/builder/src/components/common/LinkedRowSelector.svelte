<script>
  import { tables } from "stores/backend"
  import { API } from "api"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import { capitalise } from "../../helpers"
  import { createEventDispatcher } from "svelte"

  export let schema
  export let linkedRows = []

  const dispatch = createEventDispatcher()

  let rows = []
  let linkedIds = []

  $: linkedIds = (Array.isArray(linkedRows) ? linkedRows : [])?.map(
    row => row?._id || row
  )
  $: label = capitalise(schema.name)
  $: linkedTableId = schema.tableId
  $: linkedTable = $tables.list.find(table => table._id === linkedTableId)
  $: fetchRows(linkedTableId)

  async function fetchRows(linkedTableId) {
    try {
      rows = await API.fetchTableData(linkedTableId)
    } catch (error) {
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
{:else if schema.relationshipType === "one-to-many"}
  <Select
    value={linkedIds?.[0]}
    options={rows}
    getOptionLabel={getPrettyName}
    getOptionValue={row => row._id}
    on:change={e => {
      linkedIds = e.detail ? [e.detail] : []
      dispatch("change", linkedIds)
    }}
    {label}
    sort
  />
{:else}
  <Multiselect
    bind:value={linkedIds}
    {label}
    options={rows}
    getOptionLabel={getPrettyName}
    getOptionValue={row => row._id}
    sort
    on:change={() => dispatch("change", linkedIds)}
  />
{/if}
