<script>
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"
  import { queries, workspaceConnections } from "@/stores/builder"

  const initialDatasourceId = queries.resetTargetDatasourceId()
</script>

{#key $workspaceConnections.draft?.key}
  <APIEndpointViewer {initialDatasourceId} />
{/key}
