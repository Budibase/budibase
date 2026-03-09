<script>
  import { params, redirect } from "@roxi/routify"
  import QueryViewer from "@/components/integration/QueryViewer.svelte"
  import { datasources } from "@/stores/builder"

  $params
  $redirect

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: {
    if (!datasource) {
      $redirect("../../../")
    }
  }
  $: query = datasource
    ? {
        name: "Untitled query",
        transformer: "return data",
        schema: {},
        datasourceId: $params.datasourceId,
        parameters: [],
        fields: {},
        queryVerb: "read",
      }
    : null
</script>

{#if datasource && query}
  <QueryViewer {query} />
{/if}
