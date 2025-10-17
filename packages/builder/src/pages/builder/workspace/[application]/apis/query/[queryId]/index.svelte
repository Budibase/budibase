<script>
  import { queries, datasources } from "@/stores/builder"
  import RestQueryViewer from "@/components/integration/RestQueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { goto } from "@roxi/routify"

  $: query = $queries.selected
  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: isRestQuery = datasource?.source === IntegrationTypes.REST

  $: {
    if (query && !isRestQuery) {
      $goto(`../../data/query/${query._id}`)
    }
  }
</script>

{#if query && isRestQuery}
  <RestQueryViewer queryId={$queries.selectedQueryId} />
{/if}
