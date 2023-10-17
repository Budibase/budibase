<script>
  import { API } from "api"
  import { tables } from "stores/backend"

  import Table from "./Table.svelte"
  import CalculateButton from "./buttons/CalculateButton.svelte"
  import GroupByButton from "./buttons/GroupByButton.svelte"
  import ViewFilterButton from "./buttons/ViewFilterButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import ManageAccessButton from "./buttons/ManageAccessButton.svelte"
  import HideAutocolumnButton from "./buttons/HideAutocolumnButton.svelte"
  import { notifications } from "@budibase/bbui"
  import { ROW_EXPORT_FORMATS } from "constants/backend"

  export let view = {}

  let hideAutocolumns = true
  let data = []
  let loading = false
  let type = "internal"

  $: name = view.name
  $: calculation = view.calculation

  $: supportedFormats = Object.values(ROW_EXPORT_FORMATS).filter(key => {
    if (calculation && key === ROW_EXPORT_FORMATS.JSON_WITH_SCHEMA) {
      return false
    }
    return true
  })

  // Fetch rows for specified view
  $: fetchViewData(name, view.field, view.groupBy, view.calculation)

  async function fetchViewData(name, field, groupBy, calculation) {
    loading = true
    const _tables = $tables.list
    const allTableViews = _tables.map(table => table.views)
    const thisView = allTableViews.filter(
      views => views != null && views[name] != null
    )[0]

    // Don't fetch view data if the view no longer exists
    if (!thisView) {
      loading = false
      return
    }
    try {
      data = await API.fetchViewData({
        name,
        calculation,
        field,
        groupBy,
      })
    } catch (error) {
      notifications.error("Error fetching view data")
    }
    loading = false
  }
</script>

<Table
  title={decodeURI(name)}
  schema={view.schema}
  tableId={view.tableId}
  {data}
  {loading}
  {type}
  rowCount={10}
  allowEditing={false}
  bind:hideAutocolumns
>
  <ViewFilterButton {view} />
  <CalculateButton {view} />
  {#if view.calculation}
    <GroupByButton {view} />
  {/if}
  <ManageAccessButton resourceId={decodeURI(name)} />
  <HideAutocolumnButton bind:hideAutocolumns />
  <ExportButton view={view.name} formats={supportedFormats} />
</Table>
