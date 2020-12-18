<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"

  if ($params.selectedDatasourceId) {
    const datasource = $backendUiStore.datasources.find(
      m => m._id === $params.selectedDatasource
    )
    if (datasource) {
      backendUiStore.actions.datasources.select(datasource)
    }
  }
</script>

<slot />
