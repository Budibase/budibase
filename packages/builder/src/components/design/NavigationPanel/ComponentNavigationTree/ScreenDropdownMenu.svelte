<script>
  import { goto } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let screenId

  let confirmDeleteDialog
  let dropdown
  let anchor

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

  const openModal = () => {
    confirmDeleteDialog.show()
    dropdown.hide()
  }
</script>

<ActionMenu bind:this={dropdown}>
  <div slot="button" class="icon" on:click={dropdown.show}>
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={openModal}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={"Are you sure you wish to delete this screen?"}
  okText="Delete Screen"
  onOk={deleteScreen}
/>

<style>
  .icon i {
    font-size: 16px;
  }
</style>
