<script>
  import { params, redirect } from "@roxi/routify"
  import QueryViewer from "@/components/integration/QueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { datasources } from "@/stores/builder"

  $params
  $redirect

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: isRestDatasource = datasource?.source === IntegrationTypes.REST
  $: {
    if (!datasource) {
      $redirect(`/builder/workspace/${$params.application}/data`)
    } else if (isRestDatasource) {
      $redirect(
        `/builder/workspace/${$params.application}/apis/query/new/${$params.datasourceId}`
      )
    }
  }
  $: query = datasource
    ? {
        name: "Untitled query",
        transformer: "return data",
        schema: {},
        datasourceId: $params.datasourceId,
        parameters: [],
        fields: {},
        queryVerb: "read",
      }
    : null
</script>

{#if datasource && query && !isRestDatasource}
  <QueryViewer {query} />
{/if}
