<script>
  import { goto } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"

  export let screenId

  let confirmDeleteDialog

  $: screen = $allScreens.find((screen) => screen._id === screenId)

  const deleteScreen = () => {
    try {
      store.actions.screens.delete(screen)
      store.actions.routing.fetch()
      confirmDeleteDialog.hide()
      $goto("../")
      notifications.success("Deleted screen successfully.")
    } catch (err) {
      notifications.error("Error deleting screen")
    }
  }
</script>

<ActionMenu let:open let:closeOnClick>
  <div slot="button" class="icon" on:click={open}>
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={closeOnClick(confirmDeleteDialog.show)}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={"Are you sure you wish to delete this screen?"}
  okText="Delete Screen"
  onOk={deleteScreen}
/>
