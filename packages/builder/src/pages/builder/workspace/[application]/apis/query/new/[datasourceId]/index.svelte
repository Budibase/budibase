<script>
  import { params, redirect } from "@roxi/routify"
  import RestQueryViewer from "@/components/integration/RestQueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { datasources } from "@/stores/builder"

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: {
    if (!datasource) {
      $redirect("../../../")
    } else if (datasource.source !== IntegrationTypes.REST) {
      $redirect(`../../../data/query/new/${$params.datasourceId}`)
    }
  }
</script>

{#if datasource?.source === IntegrationTypes.REST}
  <RestQueryViewer />
{/if}
