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
  import { _ as t } from "svelte-i18n"

  export let view

  let editorModal
  let originalName = view.name
  let confirmDeleteDialog

  async function save() {
    await views.save({
      originalName,
      ...view,
    })
    notifications.success($t("view-renamed-successfully"))
  }

  async function deleteView() {
    const name = view.name
    const id = view.tableId
    await views.delete(name)
    notifications.success($t("view-deleted"))
    $goto(`./table/${id}`)
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editorModal.show}>{$t('edit')}</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$t('delete')}</MenuItem
  >
</ActionMenu>
<Modal bind:this={editorModal}>
  <ModalContent
    cancelText={$t("cancel")}
    title={$t("edit-view")}
    onConfirm={save}
    confirmText={$t("save")}
  >
    <Input label={$t("view-name")} thin bind:value={view.name} />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={$t("are-you-sure-you-wish-to-delete-the-view") +
    ` '${view.name}'? ` +
    $t("your-data-will-be-deleted-and-this-action-cannot-be-undone") +
    `.`}
  okText={$t("delete-view")}
  onOk={deleteView}
  title={$t("confirm-deletion")}
/>
