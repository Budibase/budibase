<script>
  import { params } from "@roxi/routify"
  import { backendUiStore } from "builderStore"
  import QueryInterface from "components/integration/QueryViewer.svelte"

  async function fetchQueryConfig() {
    try {
      const response = await api.get(`/api/integrations/${datasource.source}`)
      const json = await response.json()
      config = json.query
    } catch (err) {
      notifier.danger("Error fetching datasource configuration options.")
      console.error(err)
    }
  }

  $: selectedQuery = $backendUiStore.queries.find(
    query => query._id === $backendUiStore.selectedQueryId
  ) || {
    datasourceId: $params.selectedDatasource,
    parameters: [],
    fields: {},
    queryVerb: "read",
  }
</script>

<section>
  <div class="inner">
    {#if $backendUiStore.selectedDatabase._id && selectedQuery}
      <QueryInterface query={selectedQuery} />
    {/if}
  </div>
</section>

<style>
  section {
    overflow: scroll;
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }

  .inner {
    width: 640px;
    margin: 0 auto;
  }
</style>
