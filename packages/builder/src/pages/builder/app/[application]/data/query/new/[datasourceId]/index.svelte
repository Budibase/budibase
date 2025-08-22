<script>
  import { params, redirect } from "@roxi/routify"
  import QueryViewer from "@/components/integration/QueryViewer.svelte"
  import RestQueryViewer from "@/components/integration/RestQueryViewer.svelte"
  import GraphQLQueryViewer from "@/components/integration/GraphQLQueryViewer.svelte"
  import { IntegrationTypes } from "@/constants/backend"
  import { datasources } from "@/stores/builder"

  $: datasource = $datasources.list.find(ds => ds._id === $params.datasourceId)
  $: {
    if (!datasource) {
      $redirect("../../../")
    }
  }
  $: isRestQuery = datasource?.source === IntegrationTypes.REST
  $: isGraphQLQuery = datasource?.source === IntegrationTypes.GRAPHQL
  $: query = buildNewQuery(isRestQuery, isGraphQLQuery)

  const buildNewQuery = (isRestQuery, isGraphQLQuery) => {
    let query = {
      name: "Untitled query",
      transformer: "return data",
      schema: {},
      datasourceId: $params.datasourceId,
      parameters: [],
      fields: {},
      queryVerb: isGraphQLQuery ? "query" : "read",
    }
    if (isRestQuery) {
      query.flags = {}
      query.fields = { disabledHeaders: {}, headers: {} }
    } else if (isGraphQLQuery) {
      query.fields = {
        query: "",
        variables: "",
        operationName: "",
      }
    }
    return query
  }
</script>

{#if datasource && query}
  {#if isRestQuery}
    <RestQueryViewer />
  {:else if isGraphQLQuery}
    <GraphQLQueryViewer />
  {:else}
    <QueryViewer {query} />
  {/if}
{/if}
