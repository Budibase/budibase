<script lang="ts">
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"
  import { datasources } from "@/stores/builder"
  import { IntegrationTypes } from "@/constants/backend"

  onMount(() => {
    const restDatasources = ($datasources.list || []).filter(
      datasource => datasource.source === IntegrationTypes.REST
    )

    if (restDatasources.length) {
      $redirect(`./datasource/${restDatasources[0]._id}`)
    } else {
      $redirect("./new")
    }
  })
</script>
