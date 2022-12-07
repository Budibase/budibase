<script>
  import { params, redirect } from "@roxi/routify"
  import { datasources } from "stores/backend"

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: {
    if (!datasource) {
      $redirect("../../../")
    }
  }
</script>

<slot />
