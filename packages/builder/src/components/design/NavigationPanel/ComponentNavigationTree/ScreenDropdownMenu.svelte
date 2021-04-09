<script>
  import { goto } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownMenu, Modal, ModalContent } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let screenId

  let confirmDeleteDialog
  let dropdown
  let anchor

  $: screen = $allScreens.find(screen => screen._id === screenId)

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

<div bind:this={anchor} on:click|stopPropagation>
  <div class="icon" on:click={() => dropdown.show()}>
    <i class="ri-more-line" />
  </div>
  <DropdownMenu bind:this={dropdown} {anchor} align="left">
    <DropdownContainer>
      <DropdownItem
        icon="ri-delete-bin-line"
        title="Delete"
        on:click={() => confirmDeleteDialog.show()} />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={'Are you sure you wish to delete this screen?'}
  okText="Delete Screen"
  onOk={deleteScreen} />

<style>
  .icon i {
    font-size: 16px;
  }
</style>
