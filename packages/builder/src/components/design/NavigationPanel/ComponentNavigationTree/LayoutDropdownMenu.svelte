<script>
  import { store } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Modal,
    ModalContent,
    Input,
  } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"

  export let layout

  let confirmDeleteDialog
  let editLayoutNameModal
  let name = layout.name

  const deleteLayout = async () => {
    try {
      await store.actions.layouts.delete(layout)
      notifications.success("Layout deleted successfully")
    } catch (err) {
      notifications.error("Error deleting layout")
    }
  }

  const saveLayout = async () => {
    try {
      const layoutToSave = cloneDeep(layout)
      layoutToSave.name = name
      await store.actions.layouts.save(layoutToSave)
      notifications.success("Layout saved successfully")
    } catch (err) {
      notifications.error("Error saving layout")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editLayoutNameModal.show}>Edit</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title="Confirm Deletion"
  body={"Are you sure you wish to delete this layout?"}
  okText="Delete layout"
  onOk={deleteLayout}
/>

<Modal bind:this={editLayoutNameModal}>
  <ModalContent
    title="Edit Layout Name"
    confirmText="Save"
    onConfirm={saveLayout}
    disabled={!name}
  >
    <Input thin type="text" label="Name" bind:value={name} />
  </ModalContent>
</Modal>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
