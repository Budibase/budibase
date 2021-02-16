<script>
  import api from "builderStore/api"
  import { backendUiStore } from "builderStore"
  import Table from "./Table.svelte"
  import CalculateButton from "./buttons/CalculateButton.svelte"
  import GroupByButton from "./buttons/GroupByButton.svelte"
  import FilterButton from "./buttons/FilterButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import ManageAccessButton from "./buttons/ManageAccessButton.svelte"
  import HideAutocolumnButton from "./buttons/HideAutocolumnButton.svelte"

  export let view = {}
  let hideAutocolumns = true

  let data = []
  let loading = false

  $: name = view.name

  // Fetch rows for specified view
  $: {
    if (!name.startsWith("all_")) {
      loading = true
      fetchViewData(name, view.field, view.groupBy, view.calculation)
    }
  }

  async function fetchViewData(name, field, groupBy, calculation) {
    const tables = $backendUiStore.tables
    const allTableViews = tables.map(table => table.views)
    const thisView = allTableViews.filter(
      views => views != null && views[name] != null
    )[0]
    // don't fetch view data if the view no longer exists
    if (!thisView) {
      return
    }
    const params = new URLSearchParams()
    if (calculation) {
      params.set("field", field)
      params.set("calculation", calculation)
    }
    if (groupBy) {
      params.set("group", groupBy)
    }
    const QUERY_VIEW_URL = `/api/views/${name}?${params}`
    const response = await api.get(QUERY_VIEW_URL)
    data = await response.json()
    loading = false
  }
</script>

<Table title={decodeURI(name)} schema={view.schema} {data} {loading} bind:hideAutocolumns>
  <FilterButton {view} />
  <CalculateButton {view} />
  {#if view.calculation}
    <GroupByButton {view} />
  {/if}
  <ManageAccessButton resourceId={decodeURI(name)} />
  <HideAutocolumnButton bind:hideAutocolumns/>
  <ExportButton {view} />
</Table>
