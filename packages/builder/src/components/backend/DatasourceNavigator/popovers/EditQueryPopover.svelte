<script>
  import { goto } from "@roxi/routify"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { datasources, queries } from "stores/backend"

  export let query
  export let onClickQuery

  let confirmDeleteDialog

  async function deleteQuery() {
    try {
      const wasSelectedQuery = $queries.selected
      // need to calculate this before the query is deleted
      const navigateToDatasource = wasSelectedQuery === query._id

      await queries.delete(query)
      await datasources.fetch()

      if (navigateToDatasource) {
        await datasources.select(query.datasourceId)
        $goto(`./datasource/${query.datasourceId}`)
      }
      notifications.success("Query deleted")
    } catch (error) {
      notifications.error("Error deleting query")
    }
  }

  async function duplicateQuery() {
    try {
      const newQuery = await queries.duplicate(query)
      onClickQuery(newQuery)
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
