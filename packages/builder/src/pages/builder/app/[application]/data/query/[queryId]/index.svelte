<script>
  import { queries, datasources } from "@/stores/builder"
  import QueryViewer from "@/components/integration/QueryViewer.svelte"
  import RestQueryViewer from "@/components/integration/RestQueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { cloneDeep } from "lodash/fp"

  $: query = $queries.selected
  $: editableQuery = cloneDeep(query)
  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: isRestQuery = datasource?.source === IntegrationTypes.REST
</script>

{#if query}
  {#if isRestQuery}
    <RestQueryViewer queryId={$queries.selectedQueryId} />
  {:else}
    <QueryViewer query={editableQuery} />
  {/if}
{/if}
