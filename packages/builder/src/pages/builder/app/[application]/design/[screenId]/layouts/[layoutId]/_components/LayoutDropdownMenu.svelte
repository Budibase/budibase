<script>
  import { store } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let layout

  let confirmDeleteDialog

  const deleteLayout = async () => {
    try {
      await store.actions.layouts.delete(layout)
      notifications.success("Layout deleted successfully")
    } catch (err) {
      notifications.error(err?.message || "Error deleting layout")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={"Are you sure you wish to delete this layout?"}
  okText="Delete layout"
  onOk={deleteLayout}
/>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
