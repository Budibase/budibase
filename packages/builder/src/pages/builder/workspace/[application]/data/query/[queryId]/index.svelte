<script>
  import { queries, datasources } from "@/stores/builder"
  import QueryViewer from "@/components/integration/QueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { cloneDeep } from "lodash/fp"
  import { params, redirect } from "@roxi/routify"

  $redirect

  $: query = $queries.selected
  $: editableQuery = cloneDeep(query)
  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: isRestQuery = datasource?.source === IntegrationTypes.REST
  $: {
    if (query && isRestQuery) {
      $redirect(
        `/builder/workspace/${$params.application}/apis/query/${query._id}`
      )
    }
  }
</script>

{#if query && !isRestQuery}
  <QueryViewer query={editableQuery} />
{/if}
