<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownMenu, Modal, ModalContent } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let layoutId

  let confirmDeleteDialog
  let dropdown
  let anchor

  $: layout = $store.layouts.find(layout => layout._id === layoutId)

  const deleteLayout = async () => {
    try {
      await store.actions.layouts.delete(layout)
      notifier.success(`Layout ${layout.name} deleted successfully.`)
    } catch (err) {
      notifier.danger(`Error deleting layout: ${err.message}`)
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
  body={'Are you sure you wish to delete this layout?'}
  okText="Delete Layout"
  onOk={deleteLayout} />

<style>
  .icon i {
    font-size: 16px;
  }
</style>
