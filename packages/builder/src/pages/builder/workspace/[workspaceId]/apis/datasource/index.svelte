<script>
  import { datasources } from "@/stores/builder"
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"
  import { IntegrationTypes } from "@/constants/backend"

  onMount(async () => {
    const restDatasources = ($datasources.list || []).filter(
      datasource => datasource.source === IntegrationTypes.REST
    )

    if (restDatasources.length) {
      $redirect("../query/new")
    } else {
      $redirect("../new")
    }
  })
</script>
