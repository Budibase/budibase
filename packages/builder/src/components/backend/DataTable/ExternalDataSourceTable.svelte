<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import * as api from "./api"
  import Table from "./Table.svelte"
  import CreateQueryButton from "components/backend/DataTable/buttons/CreateQueryButton.svelte"

  export let datasourceId
  export let query = {}

  let data = []
  let loading = false
  let error = false

  $: datasourceId = $params.selectedDatasource
  // TODO: refactor
  // $: query = $backendUiStore.datasources.find(
  //   ds => ds._id === $params.selectedDatasource
  // ).queries[$params.query]
  $: title = query.name
  $: schema = query.schema

  async function fetchData() {
    try {
      loading = true
      const response = await api.fetchDataForQuery(
        $params.selectedDatasource,
        $params.query
      )
      data = response.rows || []
      error = false
    } catch (err) {
      console.log(err)
      error = `${query}: Query error. (${err.message}). This could be a problem with your datasource configuration.`
      notifier.danger(error)
    } finally {
      loading = false
    }
  }

  // Fetch rows for specified query
  $: fetchData()
</script>

{#if error}
  <div class="errors">{error}</div>
{/if}
<Table {title} {schema} {data} {loading}>
  <CreateQueryButton {query} />
</Table>

<style>
  .errors {
    color: var(--red);
    background: var(--red-light);
    padding: var(--spacing-m);
    border-radius: var(--border-radius-m);
    margin-bottom: var(--spacing-m);
  }
</style>
