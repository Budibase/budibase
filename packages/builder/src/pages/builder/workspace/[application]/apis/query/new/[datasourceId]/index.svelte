<script>
  import { params, redirect } from "@roxi/routify"
  import RestQueryViewer from "@/components/integration/RestQueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { datasources } from "@/stores/builder"
  import APIEndpointViewer from "@/components/integration/APIEndpointViewer.svelte"

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: isRestSource = datasource?.source === IntegrationTypes.REST
  $: {
    if (!datasource) {
      $redirect("../../../")
    } else if (!isRestSource) {
      $redirect(`../../../data/query/new/${$params.datasourceId}`)
    }
  }
</script>

{#if isRestSource}
  {#if datasource.restTemplate}
    <APIEndpointViewer datasourceId={$params.datasourceId} />
  {:else}
    <RestQueryViewer />
  {/if}
{/if}
