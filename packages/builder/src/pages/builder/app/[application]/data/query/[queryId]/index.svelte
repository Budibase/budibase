<script>
  import { database, queries, datasources } from "stores/backend"
  import QueryViewer from "components/integration/QueryViewer.svelte"
  import RestQueryViewer from "components/integration/RestQueryViewer.svelte"
  import { IntegrationTypes } from "constants/backend"

  $: query = $queries.selected
  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: isRestQuery = datasource?.source === IntegrationTypes.REST
</script>

{#if $database._id && query}
  {#if isRestQuery}
    <RestQueryViewer queryId={$queries.selectedQueryId} />
  {:else}
    <QueryViewer {query} />
  {/if}
{/if}
