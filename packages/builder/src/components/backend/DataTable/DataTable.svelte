<script>
  import { backendUiStore } from "builderStore"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import * as api from "./api"
  import Table from "./Table.svelte"
  import { TableNames } from "constants"
  import CreateEditUser from "./modals/CreateEditUser.svelte"
  import CreateEditRow from "./modals/CreateEditRow.svelte"

  let data = []
  let loading = false

  $: isUsersTable = $backendUiStore.selectedTable?._id === TableNames.USERS
  $: title = $backendUiStore.selectedTable.name
  $: schema = $backendUiStore.selectedTable.schema
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

<Table
  {title}
  {schema}
  tableId={$backendUiStore.selectedTable?._id}
  {data}
  allowEditing={true}
  {loading}>
  <CreateColumnButton />
  {#if schema && Object.keys(schema).length > 0}
    <CreateRowButton
      modalContentComponent={isUsersTable ? CreateEditUser : CreateEditRow} />
    <CreateViewButton />
    <ExportButton view={tableView} />
  {/if}
  {#if isUsersTable}
    <EditRolesButton />
  {/if}
</Table>
