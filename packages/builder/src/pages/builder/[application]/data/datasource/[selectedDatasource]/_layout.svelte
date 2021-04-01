<script>
  import { params } from "@roxi/routify"
  import { datasources } from "stores/backend"

  if ($params.selectedDatasource) {
    const datasource = $datasources.list.find(
      m => m._id === $params.selectedDatasource
    )
    if (datasource) {
      datasources.select(datasource._id)
    }
  }
</script>

<slot />
