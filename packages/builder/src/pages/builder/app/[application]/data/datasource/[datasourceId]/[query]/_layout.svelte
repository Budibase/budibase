<script>
  import { params } from "@roxi/routify"
  import { queries, datasources } from "stores/backend"
  import { IntegrationTypes } from "constants/backend"
  import { redirect } from "@roxi/routify"

  let datasourceId
  if ($params.query) {
    const query = $queries.list.find(q => q._id === $params.query)
    if (query) {
      queries.select(query)
      datasourceId = query.datasourceId
    }
  }
  const datasource = $datasources.list.find(
    ds => ds._id === $datasources.selected || ds._id === datasourceId
  )
  if (datasource?.source === IntegrationTypes.REST) {
    $redirect(`../rest/${$params.query}`)
  }
</script>

<slot />
