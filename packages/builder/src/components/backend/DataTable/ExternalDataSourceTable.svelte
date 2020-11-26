<script>
  import { backendUiStore } from "builderStore"
  import * as api from "./api"
  import Table from "./Table.svelte"
  import EditIntegrationConfigButton from "./buttons/EditIntegrationConfigButton.svelte"

  let data = []
  let loading = false

  $: table = $backendUiStore.selectedTable
  $: title = table.name
  $: schema = table.schema
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
  <EditIntegrationConfigButton {table} />
</Table>
