<script>
  import { params, redirect } from "@roxi/routify"
  import { database, datasources, queries } from "stores/backend"
  import QueryInterface from "components/integration/QueryViewer.svelte"
  import { IntegrationTypes } from "constants/backend"

  let selectedQuery, datasource
  $: selectedQuery = $queries.list.find(
    query => query._id === $queries.selected
  ) || {
    datasourceId: $params.selectedDatasource,
    parameters: [],
    fields: {},
    queryVerb: "read",
  }
  $: datasource = $datasources.list.find(
    ds => ds._id === $params.selectedDatasource
  )
  $: {
    if (datasource?.source === IntegrationTypes.REST) {
      $redirect(`../rest/${$params.query}`)
    }
  }
</script>

<section>
  <div class="inner">
    {#if $database._id && selectedQuery}
      <QueryInterface query={selectedQuery} />
    {/if}
  </div>
</section>

<style>
  .inner {
    width: 640px;
    margin: 0 auto;
  }
</style>
