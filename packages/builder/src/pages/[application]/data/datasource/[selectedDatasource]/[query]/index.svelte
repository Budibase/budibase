<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { Switcher } from "@budibase/bbui"
  import QueryInterface from "components/integration/QueryViewer.svelte"

  let query

  $: {
    if ($params.query !== "new") {
      query = $backendUiStore.queries.find(query => query._id === $params.query)
    } else {
      // New query
      query = {
        datasourceId: $params.selectedDatasource,
        name: "New Query",
        parameters: {},
        // TODO: set dynamically
      }
    }
  }
</script>

<section>
  {#if $backendUiStore.selectedDatabase._id && query}
    <QueryInterface {query} />
  {/if}
</section>

<style>
  section {
    background: var(--background);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-m);
  }
</style>
