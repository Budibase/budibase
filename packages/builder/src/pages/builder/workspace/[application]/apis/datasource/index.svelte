<script>
  import { datasources } from "@/stores/builder"
  import { redirect } from "@roxi/routify"
  import { onMount } from "svelte"
  import { IntegrationTypes } from "@/constants/backend"

  onMount(async () => {
    const restDatasources = ($datasources.list || []).filter(
      datasource => datasource.source === IntegrationTypes.REST
    )

    if ($datasources.selected?.source === IntegrationTypes.REST) {
      $redirect(`./${$datasources.selected?._id}`)
    } else if (restDatasources.length) {
      $redirect(`./${restDatasources[0]._id}`)
    } else {
      $redirect("../new")
    }
  })
</script>
