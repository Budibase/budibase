<script>
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"
  import { queries, workspaceConnections } from "@/stores/builder"

  const datasourceId = queries.resetTargetDatasourceId()
</script>

{#key $workspaceConnections.draft?.key}
  <APIEndpointViewer {datasourceId} />
{/key}
