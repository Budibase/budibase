<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { Switcher } from "@budibase/bbui"
  import QueryInterface from "components/integration/QueryViewer.svelte"

  let query

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
  {#if $backendUiStore.selectedDatabase._id && selectedQuery}
    <QueryInterface query={selectedQuery} />
  {/if}
</section>

<style>
  section {
    overflow: scroll;
    width: 640px;
    margin: 0 auto;
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
  }
</style>
