<script>
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"
  import { queries } from "@/stores/builder"

  // Use the datasource of the currently selected query as the initial suggestion
  // (e.g. when clicking + from within a query)
  $: selectedDatasourceId = $queries.list.find(
    q => q._id === $queries.selectedQueryId
  )?.datasourceId
</script>

<APIEndpointViewer initialDatasourceId={selectedDatasourceId} />
