<script>
  import api from "builderStore/api"
  import Table from "./Table.svelte"
  import CalculateButton from "./buttons/CalculateButton.svelte"
  import GroupByButton from "./buttons/GroupByButton.svelte"
  import FilterButton from "./buttons/FilterButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"

  export let view = {}

  let data = []

  $: name = view.name

  // Fetch rows for specified view
  $: {
    if (!name.startsWith("all_")) {
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
  }
</script>

<Table title={decodeURI(name)} schema={view.schema} {data}>
  <FilterButton {view} />
  <CalculateButton {view} />
  {#if view.calculation}
    <GroupByButton {view} />
  {/if}
  <ExportButton {view} />
</Table>
