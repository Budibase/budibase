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
    name: "New Query",
    parameters: [],
    fields: {},
  }

  // $: {
  //   if ($params.query !== "new") {
  //     query = $backendUiStore.queries.find(query => query._id === $params.query)
  //   } else {
  //     // New query
  //     query = {
  //       datasourceId: $params.selectedDatasource,
  //       name: "New Query",
  //       parameters: [],
  //       fields: {},
  //     }
  //   }
  // }
</script>

<section>
  {#if $backendUiStore.selectedDatabase._id && selectedQuery}
    <QueryInterface query={selectedQuery} />
  {/if}
</section>

<style>
  section {
    background: var(--background);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-m);
  }
</style>
