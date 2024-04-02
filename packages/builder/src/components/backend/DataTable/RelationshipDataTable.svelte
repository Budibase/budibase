<script>
  import { API } from "api"
  import Table from "./Table.svelte"
  import { tables } from "stores/builder"
  import { notifications } from "@budibase/bbui"

  export let tableId
  export let rowId
  export let fieldName

  let row
  let title

  $: data = row?.[fieldName] ?? []
  $: linkedTableId = data?.length ? data[0].tableId : null
  $: linkedTable = $tables.list.find(table => table._id === linkedTableId)
  $: schema = linkedTable?.schema
  $: table = $tables.list.find(table => table._id === tableId)
  $: fetchData(tableId, rowId)
  $: {
    let rowLabel = row?.[table?.primaryDisplay]
    if (rowLabel) {
      title = `${rowLabel} - ${fieldName}`
    } else {
      title = fieldName
    }
  }

  async function fetchData(tableId, rowId) {
    try {
      row = await API.fetchRelationshipData({
        tableId,
        rowId,
      })
    } catch (error) {
      row = null
      notifications.error("Error fetching relationship data")
    }
  }
</script>

{#if row && row._id === rowId}
  <Table {title} {schema} {data} />
{/if}
