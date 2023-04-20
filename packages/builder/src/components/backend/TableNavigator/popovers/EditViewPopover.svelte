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
  import { _ } from "../../../../../lang/i18n"

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
    notifications.success(
      $_(
        "components.backend.TableNavigation.popovers.EditViewPopover.View_renamed"
      )
    )
  }

  async function deleteView() {
    try {
      const isSelected =
        decodeURIComponent($params.viewName) === $views.selectedViewName
      const name = view.name
      const id = view.tableId
      await views.delete(name)
      notifications.success(
        $_(
          "components.backend.TableNavigation.popovers.EditViewPopover.View_deleted"
        )
      )
      if (isSelected) {
        $goto(`./table/${id}`)
      }
    } catch (error) {
      notifications.error(
        $_(
          "components.backend.TableNavigation.popovers.EditViewPopover.Error_deleting"
        )
      )
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
  <MenuItem icon="Edit" on:click={editorModal.show}
    >{$_(
      "components.backend.TableNavigation.popovers.EditViewPopover.Edit"
    )}</MenuItem
  >
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$_(
      "components.backend.TableNavigation.popovers.EditViewPopover.Delete"
    )}</MenuItem
  >
</ActionMenu>
<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent
    title={$_(
      "components.backend.TableNavigation.popovers.EditViewPopover.Edit_View"
    )}
    onConfirm={save}
    confirmText={$_(
      "components.backend.TableNavigation.popovers.EditViewPopover.Save"
    )}
  >
    <Input
      label={$_(
        "components.backend.TableNavigation.popovers.EditViewPopover.View_Name"
      )}
      thin
      bind:value={updatedName}
    />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`${$_(
    "components.backend.TableNavigation.popovers.EditViewPopover.wish_delete"
  )} '${view.name}'? ${$_(
    "components.backend.TableNavigation.popovers.EditViewPopover.undone"
  )}.`}
  okText={$_(
    "components.backend.TableNavigation.popovers.EditViewPopover.Delete_View"
  )}
  onOk={deleteView}
  title={$_(
    "components.backend.TableNavigation.popovers.EditViewPopover.Confirm_Deletion"
  )}
/>
