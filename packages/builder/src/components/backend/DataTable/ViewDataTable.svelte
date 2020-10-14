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
      fetchViewData(name, view.field, view.groupBy)
    }
  }

  async function fetchViewData(name, field, groupBy) {
    const params = new URLSearchParams()
    if (field) {
      params.set("field", field)
      params.set("stats", true)
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
  <GroupByButton {view} />
  <ExportButton {view} />
</Table>
