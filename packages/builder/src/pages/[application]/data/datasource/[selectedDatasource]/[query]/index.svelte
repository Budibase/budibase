<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"

  $: datasourceId = $params.selectedDatasource
  // TODO: refactor
  $: datasource = $backendUiStore.datasources.find(
    ds => ds._id === $params.selectedDatasource
  )
  $: query = datasource?.queries[$params.query]
</script>

{#if $backendUiStore.selectedDatabase._id && query}
  <ExternalDataSourceTable {query} {datasourceId} />
{/if}
