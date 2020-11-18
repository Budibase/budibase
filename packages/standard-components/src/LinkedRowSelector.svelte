<script>
  import { Label, Multiselect } from "@budibase/bbui"
  import { capitalise } from "./helpers"
  import { getContext } from "svelte"

  const { API } = getContext("app")

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

  async function fetchTable(id) {
    if (id != null) {
      linkedTable = await API.fetchTableDefinition(id)
    }
  }

  async function fetchRows(id) {
    if (id != null) {
      allRows = await API.fetchTableData(id)
    }
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
