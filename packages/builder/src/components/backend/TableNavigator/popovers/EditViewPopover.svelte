<script>
  import { goto, params } from "@roxi/routify"
  import { views } from "stores/backend"
  import { cloneDeep } from "lodash/fp"
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
  let originalName
  let updatedName
  let confirmDeleteDialog

  async function save() {
    const updatedView = cloneDeep(view)
    updatedView.name = updatedName

    await views.save({
      originalName,
      ...updatedView,
    })
    notifications.success("View renamed successfully")
  }

  async function deleteView() {
    try {
      const isSelected =
        decodeURIComponent($params.viewName) === $views.selectedViewName
      const name = view.name
      const id = view.tableId
      await views.delete(name)
      notifications.success("View deleted")
      if (isSelected) {
        $goto(`./table/${id}`)
      }
    } catch (error) {
      notifications.error("Error deleting view")
    }
  }

  const initForm = () => {
    updatedName = view.name + ""
    originalName = view.name + ""
  }
</script>

<ActionMenu>
  <div slot="control" class="icon open-popover">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editorModal.show}>Edit</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>
<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent title="Edit View" onConfirm={save} confirmText="Save">
    <Input label="View Name" thin bind:value={updatedName} />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete the view '${view.name}'? Your data will be deleted and this action cannot be undone.`}
  okText="Delete View"
  onOk={deleteView}
  title="Confirm Deletion"
/>
