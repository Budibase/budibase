<script>
  import { tables } from "@/stores/builder"
  import { API } from "@/api"
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import { capitalise } from "@/helpers"
  import { createEventDispatcher } from "svelte"

  export let schema
  export let linkedData
  export let useLabel = true
  export let linkedTableId
  export let label
  const dispatch = createEventDispatcher()

  let rows = []
  let linkedIds = []

  $: fieldValue = getFieldValue(linkedData, schema)
  $: label = label || capitalise(schema.name)
  $: linkedTableId = linkedTableId || schema.tableId
  $: linkedTable = $tables.list.find(table => table._id === linkedTableId)
  $: fetchRows(linkedTableId)

  const getFieldValue = val => {
    const linkedIds = (Array.isArray(val) ? val : [])?.map(
      row => row?._id || row
    )
    if (
      schema.relationshipType === "one-to-many" ||
      schema.type === "bb_reference_single"
    ) {
      return linkedIds[0]
    } else {
      return linkedIds
    }
  }

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
{:else if schema.relationshipType === "one-to-many" || schema.type === "bb_reference_single"}
  <Select
    value={fieldValue}
    options={rows}
    getOptionLabel={getPrettyName}
    getOptionValue={row => row._id}
    on:change={e => {
      linkedIds = e.detail ? [e.detail] : []
      dispatch("change", linkedIds)
    }}
    label={useLabel ? label : null}
    sort
  />
{:else}
  <Multiselect
    value={fieldValue}
    label={useLabel ? label : null}
    options={rows}
    getOptionLabel={getPrettyName}
    getOptionValue={row => row._id}
    sort
    on:change
  />
{/if}
