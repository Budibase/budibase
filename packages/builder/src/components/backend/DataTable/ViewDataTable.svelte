<script>
  import api from "builderStore/api"
  import Table from "./Table.svelte"
  import CalculationPopover from "./popovers/Calculate.svelte"
  import GroupByPopover from "./popovers/GroupBy.svelte"
  import FilterPopover from "./popovers/Filter.svelte"

  export let view = {}

  let data = []

  $: name = view.name

  // Fetch records for specified view
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
  <FilterPopover {view} />
  <CalculationPopover {view} />
  {#if view.calculation}
    <GroupByPopover {view} />
  {/if}
</Table>
