<script>
  import { params, redirect } from "@roxi/routify"
  import { datasources, queries } from "@/stores/builder"
  import { IntegrationTypes } from "@/constants/backend"

  $redirect

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: isRestDatasource = datasource?.source === IntegrationTypes.REST
  $: {
    if ($datasources.list.length && !datasource) {
      $redirect(`/builder/workspace/${$params.application}/apis`)
    } else if (datasource && !isRestDatasource) {
      $redirect(
        `/builder/workspace/${$params.application}/data/query/new/${$params.datasourceId}`
      )
    } else if (datasource && isRestDatasource) {
      queries.setNewQueryDatasourceId($params.datasourceId)
      $redirect(`/builder/workspace/${$params.application}/apis/query/new`)
    }
  }
</script>
