<script>
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { queries } from "stores/backend"

  export let query

  let confirmDeleteDialog

  async function deleteQuery() {
    await queries.delete(query)
    notifications.success("Query deleted")
  }
</script>

<ActionMenu>
  <div slot="button" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >Delete</MenuItem
  >
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
