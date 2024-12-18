<script>
  import { params, redirect } from "@roxi/routify"
  import QueryViewer from "@/components/integration/QueryViewer.svelte"
  import RestQueryViewer from "@/components/integration/RestQueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { datasources } from "@/stores/builder"

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: {
    if (!datasource) {
      $redirect("../../../")
    }
  }
  $: isRestQuery = datasource?.source === IntegrationTypes.REST
  $: query = buildNewQuery(isRestQuery)

  const buildNewQuery = isRestQuery => {
    let query = {
      name: "Untitled query",
      transformer: "return data",
      schema: {},
      datasourceId: $params.datasourceId,
      parameters: [],
      fields: {},
      queryVerb: "read",
    }
    if (isRestQuery) {
      query.flags = {}
      query.fields = { disabledHeaders: {}, headers: {} }
    }
    return query
  }
</script>

{#if datasource && query}
  {#if isRestQuery}
    <RestQueryViewer />
  {:else}
    <QueryViewer {query} />
  {/if}
{/if}
