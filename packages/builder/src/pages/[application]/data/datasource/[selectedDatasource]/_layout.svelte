<script>
  import { params } from "@sveltech/routify"
  import { datasources } from 'builderStore/store/backend/'

  if ($params.selectedDatasource) {
    const datasource = $datasources.sources.find(
      m => m._id === $params.selectedDatasource
    )
    if (datasource) {
      datasources.select(datasource._id)
    }
  }
</script>

<slot />
