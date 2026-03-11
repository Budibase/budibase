<script>
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"
  import { queries } from "@/stores/builder"
  import { get } from "svelte/store"

  const initialDatasourceId =
    queries.resetTargetDatasourceId() ||
    get(queries).list.find(q => q._id === get(queries).selectedQueryId)
      ?.datasourceId
</script>

<APIEndpointViewer {initialDatasourceId} />
