<script>
  import { goto } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"

  export let screenId

  let confirmDeleteDialog

  $: screen = $allScreens.find(screen => screen._id === screenId)
  $: noPaste = !$store.componentToPaste

  const deleteScreen = async () => {
    try {
      await store.actions.screens.delete(screen)
      $goto("../")
      notifications.success("Deleted screen successfully.")
    } catch (err) {
      notifications.error("Error deleting screen")
    }
  }

  const pasteComponent = () => {
    try {
      // lives in store - also used by drag drop
      store.actions.components.paste(screen, "below")
    } catch (error) {
      notifications.error("Error saving component")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Paste" on:click={pasteComponent} disabled={noPaste}>
    Paste
  </MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={"Are you sure you wish to delete this screen?"}
  okText="Delete Screen"
  onOk={deleteScreen}
/>
