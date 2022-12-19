<script>
  import { goto } from "@roxi/routify"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { datasources, queries } from "stores/backend"

  export let query

  let confirmDeleteDialog

  async function deleteQuery() {
    try {
      // Go back to the datasource if we are deleting the active query
      if ($queries.selectedQueryId === query._id) {
        $goto(`./datasource/${query.datasourceId}`)
      }
      await queries.delete(query)
      await datasources.fetch()
      notifications.success("Query deleted")
    } catch (error) {
      notifications.error("Error deleting query")
    }
  }

  async function duplicateQuery() {
    try {
      const newQuery = await queries.duplicate(query)
      $goto(`./query/${newQuery._id}`)
    } catch (error) {
      notifications.error("Error duplicating query")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
  <MenuItem icon="Duplicate" on:click={duplicateQuery}>Duplicate</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Query"
  onOk={deleteQuery}
  title="Confirm Deletion"
>
  Are you sure you wish to delete this query? This action cannot be undone.
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
