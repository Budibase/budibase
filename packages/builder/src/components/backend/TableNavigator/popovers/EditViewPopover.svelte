<script>
  import { goto } from "@roxi/routify"
  import { views } from "stores/backend"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import {
    notifications,
    Icon,
    Input,
    ActionMenu,
    MenuItem,
    Modal,
    ModalContent,
  } from "@budibase/bbui"

  export let view

  let editorModal
  let originalName = view.name
  let confirmDeleteDialog

  async function save() {
    await views.save({
      originalName,
      ...view,
    })
    notifications.success("View renamed successfully")
  }

  async function deleteView() {
    try {
      const name = view.name
      const id = view.tableId
      await views.delete(name)
      notifications.success("View deleted")
      $goto(`./table/${id}`)
    } catch (error) {
      notifications.error("Error deleting view")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon open-popover">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editorModal.show}>Edit</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>
<Modal bind:this={editorModal}>
  <ModalContent title="Edit View" onConfirm={save} confirmText="Save">
    <Input label="View Name" thin bind:value={view.name} />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete the view '${view.name}'? Your data will be deleted and this action cannot be undone.`}
  okText="Delete View"
  onOk={deleteView}
  title="Confirm Deletion"
/>
