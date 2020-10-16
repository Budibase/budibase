<script>
  import api from "builderStore/api"
  import Table from "./Table.svelte"
  import CalculateButton from "./buttons/CalculateButton.svelte"
  import GroupByButton from "./buttons/GroupByButton.svelte"
  import FilterButton from "./buttons/FilterButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"

  export let view = {}

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

<Table title={decodeURI(name)} schema={view.schema} {data} {loading}>
  <FilterButton {view} />
  <CalculateButton {view} />
  {#if view.calculation}
    <GroupByButton {view} />
  {/if}
  <ExportButton {view} />
</Table>
