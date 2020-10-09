<script>
  import api from "builderStore/api"
  import Table from "./Table.svelte"
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"

  export let tableId
  export let recordId
  export let fieldName

  let record
  let title

  $: data = record?.[fieldName] ?? []
  $: linkedTableId = data?.length ? data[0].tableId : null
  $: linkedTable = $backendUiStore.tables.find(
    table => table._id === linkedTableId
  )
  $: schema = linkedTable?.schema
  $: table = $backendUiStore.tables.find(table => table._id === tableId)
  $: fetchData(tableId, recordId)
  $: {
    let recordLabel = record?.[table?.primaryDisplay]
    if (recordLabel) {
      title = `${recordLabel} - ${fieldName}`
    } else {
      title = fieldName
    }
  }

  async function fetchData(tableId, recordId) {
    const QUERY_VIEW_URL = `/api/${tableId}/${recordId}/enrich`
    const response = await api.get(QUERY_VIEW_URL)
    record = await response.json()
  }
</script>

{#if record && record._id === recordId}
  <Table {title} {schema} {data} />
{/if}
