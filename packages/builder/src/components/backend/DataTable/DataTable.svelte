<script>
  import { backendUiStore } from "builderStore"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import ManageAccessButton from "./buttons/ManageAccessButton.svelte"
  import HideAutocolumnButton from "./buttons/HideAutocolumnButton.svelte"
  import * as api from "./api"
  import Table from "./Table.svelte"
  import { TableNames } from "constants"
  import CreateEditUser from "./modals/CreateEditUser.svelte"
  import CreateEditRow from "./modals/CreateEditRow.svelte"

  let data = []
  let loading = false
  let hideAutocolumns

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
  bind:hideAutocolumns
  {loading}>
  <CreateColumnButton />
  {#if schema && Object.keys(schema).length > 0}
    <CreateRowButton
      title={isUsersTable ? 'Create New User' : 'Create New Row'}
      modalContentComponent={isUsersTable ? CreateEditUser : CreateEditRow} />
    <CreateViewButton />
    <ManageAccessButton resourceId={$backendUiStore.selectedTable?._id} />
    <ExportButton view={tableView} />
    <HideAutocolumnButton bind:hideAutocolumns />
  {/if}
  {#if isUsersTable}
    <EditRolesButton />
  {/if}
</Table>
