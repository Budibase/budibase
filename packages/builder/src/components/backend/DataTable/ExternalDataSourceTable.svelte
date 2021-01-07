<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import * as api from "./api"
  import Table from "./Table.svelte"

  export let query = {}
  export let data = []

  let loading = false
  let error = false

  async function fetchData() {
    try {
      loading = true
      const response = await api.fetchDataForQuery(
        $params.selectedDatasource,
        query._id
      )
      data = response.rows || []
      error = false
    } catch (err) {
      error = `${query}: Query error. (${err.message}). This could be a problem with your datasource configuration.`
      notifier.danger(error)
    } finally {
      loading = false
    }
  }

  // Fetch rows for specified query
  // $: query && fetchData()
</script>

{#if error}
  <div class="errors">{error}</div>
{/if}
<Table title={''} schema={query.schema} {data} {loading} />

<style>
  .errors {
    color: var(--red);
    background: var(--red-light);
    padding: var(--spacing-m);
    border-radius: var(--border-radius-m);
    margin-bottom: var(--spacing-m);
  }
</style>
