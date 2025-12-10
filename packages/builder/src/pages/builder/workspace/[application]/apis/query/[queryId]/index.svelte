<script>
  import { queries, datasources } from "@/stores/builder"
  import RestQueryViewer from "@/components/integration/RestQueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { goto } from "@roxi/routify"
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"

  $: query = $queries.selected
  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: isRestSource = datasource?.source === IntegrationTypes.REST

  $: {
    if (query && !isRestSource) {
      $goto(`../../data/query/${query._id}`)
    }
  }
</script>

{#if query && isRestSource}
  {#if datasource.restTemplate}
    <APIEndpointViewer queryId={$queries.selectedQueryId} />
  {:else}
    <RestQueryViewer queryId={$queries.selectedQueryId} />
  {/if}
{/if}
