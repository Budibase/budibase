<script>
  import { params } from "@roxi/routify"
  import { database, queries, entities } from "stores/backend"
  import QueryInterface from "components/integration/QueryViewer.svelte"

  $: selectedQuery = $queries.list.find(
    query => query._id === $queries.selected
  ) || {
    datasourceId: $params.selectedDatasource,
    parameters: [],
    fields: {},
    queryVerb: "read",
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
