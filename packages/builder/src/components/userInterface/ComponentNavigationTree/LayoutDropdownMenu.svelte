<script>
  import { goto } from "@sveltech/routify"
  import { store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownMenu, Modal, ModalContent, Input } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"
  import { cloneDeep } from "lodash/fp"

  export let layout

  let confirmDeleteDialog
  let editLayoutNameModal
  let dropdown
  let anchor
  let name = layout.name

  const deleteLayout = async () => {
    try {
      await store.actions.layouts.delete(layout)
      notifier.success(`Layout ${layout.name} deleted successfully.`)
    } catch (err) {
      notifier.danger(`Error deleting layout: ${err.message}`)
    }
  }

  const saveLayout = async () => {
    try {
      const layoutToSave = cloneDeep(layout)
      layoutToSave.name = name
      await store.actions.layouts.save(layoutToSave)
      notifier.success(`Layout saved successfully.`)
    } catch (err) {
      notifier.danger(`Error saving layout: ${err.message}`)
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
      <DropdownItem
        icon="ri-pencil-line"
        title="Edit"
        on:click={() => editLayoutNameModal.show()} />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={'Are you sure you wish to delete this layout?'}
  okText="Delete Layout"
  onOk={deleteLayout} />

<Modal bind:this={editLayoutNameModal}>
  <ModalContent
    title="Edit Layout Name"
    confirmText="Save"
    onConfirm={saveLayout}
    disabled={!name}>
    <Input thin type="text" label="Name" bind:value={name} />
  </ModalContent>
</Modal>

<style>
  .icon i {
    font-size: 16px;
  }
</style>
