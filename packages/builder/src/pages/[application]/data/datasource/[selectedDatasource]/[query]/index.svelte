<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"

  $: query = $backendUiStore.queries.find(query => query._id === $params.query)
  $: console.log("updated", query)
</script>

{#if $backendUiStore.selectedDatabase._id && query}
  <ExternalDataSourceTable {query} />
{/if}
