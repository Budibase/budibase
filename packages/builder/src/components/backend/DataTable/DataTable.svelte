<script>
  import { backendUiStore } from "builderStore"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import * as api from "./api"
  import Table from "./Table.svelte"

  let data = []
  let loading = false

  $: title = $backendUiStore.selectedTable.name
  $: schema = $backendUiStore.selectedTable.schema
  $: tableId = $backendUiStore.selectedTable._id
  $: tableView = {
    schema,
    name: $backendUiStore.selectedView.name,
  }

  // Fetch rows for specified table
  $: {
    if ($backendUiStore.selectedView?.name?.startsWith("all_")) {
      loading = true
      api.fetchDataForView($backendUiStore.selectedView).then(rows => {
        data = rows || []
        loading = false
      })
    }
  }
</script>

<Table {title} {schema} {data} allowEditing={true} {loading}>
  <CreateColumnButton />
  {#if Object.keys(schema).length > 0}
    <CreateRowButton />
    <CreateViewButton />
    <ExportButton view={tableView} />
  {/if}
</Table>
