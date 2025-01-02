<script>
  import { views, tables } from "@/stores/builder"
  import { API } from "@/api"
  import Table from "@/components/backend/DataTable/Table.svelte"
  import CalculateButton from "@/components/backend/DataTable/buttons/CalculateButton.svelte"
  import GroupByButton from "@/components/backend/DataTable/buttons/GroupByButton.svelte"
  import ViewFilterButton from "@/components/backend/DataTable/buttons/ViewFilterButton.svelte"
  import ExportButton from "@/components/backend/DataTable/buttons/ExportButton.svelte"
  import ManageAccessButton from "@/components/backend/DataTable/buttons/ManageAccessButton.svelte"
  import HideAutocolumnButton from "@/components/backend/DataTable/buttons/HideAutocolumnButton.svelte"
  import { notifications } from "@budibase/bbui"
  import { ROW_EXPORT_FORMATS } from "@/constants/backend"

  let hideAutocolumns = true
  let data = []
  let loading = false

  $: view = $views.selected
  $: name = view?.name
  $: schema = view?.schema
  $: calculation = view?.calculation
  $: supportedFormats = Object.values(ROW_EXPORT_FORMATS).filter(key => {
    if (calculation && key === ROW_EXPORT_FORMATS.JSON_WITH_SCHEMA) {
      return false
    }
    return true
  })

  // Fetch rows for specified view
  $: fetchViewData(name, view?.field, view?.groupBy, view?.calculation)

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
      data = await API.fetchViewData(name, {
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

<div class="view-v1">
  {#if view}
    <Table
      {schema}
      tableId={view.tableId}
      {data}
      {loading}
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
  {:else}<i>Create your first table to start building</i>{/if}
</div>

<style>
  .view-v1 {
    padding: 0 var(--spacing-xl);
  }
  i {
    font-size: var(--font-size-m);
    color: var(--grey-4);
    margin-top: 2px;
  }
</style>
