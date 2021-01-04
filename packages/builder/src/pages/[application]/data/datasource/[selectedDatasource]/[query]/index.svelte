<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"

  // TODO: refactor
  $: datasource = $backendUiStore.datasources.find(
    ds => ds._id === $params.selectedDatasource
  )
  $: query = datasource && datasource.queries[$params.query]
</script>

{#if $backendUiStore.selectedDatabase._id && datasource}
  <ExternalDataSourceTable {query} datasourceId={datasource._id} />
{/if}
