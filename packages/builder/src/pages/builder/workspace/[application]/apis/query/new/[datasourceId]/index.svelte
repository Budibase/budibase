<script>
  import { params } from "@roxi/routify"
  import { datasources } from "@/stores/builder"
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
</script>

{#if datasource}
  <APIEndpointViewer datasourceId={$params.datasourceId} />
{/if}
