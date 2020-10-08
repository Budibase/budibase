<script>
  import api from "builderStore/api"
  import Table from "./Table.svelte"
  import { onMount } from "svelte"
  import { backendUiStore } from "builderStore"

  export let modelId
  export let recordId
  export let fieldName

  let record
  let title

  $: data = record?.[fieldName] ?? []
  $: linkedModelId = data?.length ? data[0].modelId : null
  $: linkedModel = $backendUiStore.models.find(
    model => model._id === linkedModelId
  )
  $: schema = linkedModel?.schema
  $: model = $backendUiStore.models.find(model => model._id === modelId)
  $: fetchData(modelId, recordId)
  $: {
    let recordLabel = record?.[model?.primaryDisplay]
    if (recordLabel) {
      title = `${recordLabel} - ${fieldName}`
    } else {
      title = fieldName
    }
  }

  async function fetchData(modelId, recordId) {
    const QUERY_VIEW_URL = `/api/${modelId}/${recordId}/enrich`
    const response = await api.get(QUERY_VIEW_URL)
    record = await response.json()
  }
</script>

{#if record && record._id === recordId}
  <Table {title} {schema} {data} />
{/if}
