<script>
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"
  import { queries, workspaceConnections } from "@/stores/builder"

  const datasourceId = queries.resetTargetDatasourceId()
  $: initialProjectIds = (() => {
    if (typeof window === "undefined") {
      return []
    }
    const projectId = new URLSearchParams(window.location.search).get("project")
    return projectId ? [projectId] : []
  })()
</script>

{#key $workspaceConnections.draft?.key}
  <APIEndpointViewer {datasourceId} {initialProjectIds} />
{/key}
