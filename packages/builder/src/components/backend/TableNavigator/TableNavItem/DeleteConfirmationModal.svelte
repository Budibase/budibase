<script>
  import { goto, params } from "@roxi/routify"
  import { tables, datasources, screenStore } from "stores/builder"
  import { Input, notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DB_TYPE_EXTERNAL } from "constants/backend"

  export let table

  let confirmDeleteDialog

  export const show = () => {
    templateScreens = $screenStore.screens.filter(
      screen => screen.autoTableId === table._id
    )
    willBeDeleted = ["All table data"].concat(
      templateScreens.map(screen => `Screen ${screen.routing?.route || ""}`)
    )
    confirmDeleteDialog.show()
  }

  let templateScreens
  let willBeDeleted
  let deleteTableName

  async function deleteTable() {
    const isSelected = $params.tableId === table._id
    try {
      await tables.delete(table)
      // Screens need deleted one at a time because of undo/redo
      for (let screen of templateScreens) {
        await screenStore.delete(screen)
      }
      if (table.sourceType === DB_TYPE_EXTERNAL) {
        await datasources.fetch()
      }
      notifications.success("Table deleted")
      if (isSelected) {
        $goto(`./datasource/${table.datasourceId}`)
      }
    } catch (error) {
      notifications.error(`Error deleting table - ${error.message}`)
    }
  }

  function hideDeleteDialog() {
    deleteTableName = ""
  }
</script>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Table"
  onOk={deleteTable}
  onCancel={hideDeleteDialog}
  title="Confirm Deletion"
  disabled={deleteTableName !== table.name}
>
  <p>
    Are you sure you wish to delete the table
    <b>{table.name}?</b>
    The following will also be deleted:
  </p>
  <b>
    <div class="delete-items">
      {#each willBeDeleted as item}
        <div>{item}</div>
      {/each}
    </div>
  </b>
  <p>
    This action cannot be undone - to continue please enter the table name below
    to confirm.
  </p>
  <Input bind:value={deleteTableName} placeholder={table.name} />
</ConfirmDialog>

<style>
  div.delete-items {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  div.delete-items div {
    margin-top: 4px;
    font-weight: 600;
  }
</style>
