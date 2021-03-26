<script>
  import api from "builderStore/api"
  import Table from "./Table.svelte"
  import { tables } from 'stores/backend/'

  export let tableId
  export let rowId
  export let fieldName

  let row
  let title

  $: data = row?.[fieldName] ?? []
  $: linkedTableId = data?.length ? data[0].tableId : null
  $: linkedTable = $tables.list.find(
    table => table._id === linkedTableId
  )
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
    const QUERY_VIEW_URL = `/api/${tableId}/${rowId}/enrich`
    const response = await api.get(QUERY_VIEW_URL)
    row = await response.json()
  }
</script>

{#if row && row._id === rowId}
  <Table {title} {schema} {data} />
{/if}
