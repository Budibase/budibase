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
  import { _ as t } from "svelte-i18n"

  export let layout

  let confirmDeleteDialog
  let editLayoutNameModal
  let name = layout.name

  const deleteLayout = async () => {
    try {
      await store.actions.layouts.delete(layout)
      notifications.success(
        $t("layout") + ` ${layout.name} ` + $t("deleted-successfully") + `.`
      )
    } catch (err) {
      notifications.error($t("error-deleting-layout") + `: ${err.message}`)
    }
  }

  const saveLayout = async () => {
    try {
      const layoutToSave = cloneDeep(layout)
      layoutToSave.name = name
      await store.actions.layouts.save(layoutToSave)
      notifications.success($t("layout-saved-successfully") + `.`)
    } catch (err) {
      notifications.error($t("error-saving-layout") + `: ${err.message}`)
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editLayoutNameModal.show}
    >{$t("edit")}</MenuItem
  >
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$t("delete")}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title={$t("confirm-deletion")}
  body={$t("are-you-sure-you-wish-to-delete-this-layout")}
  okText={$t("delete-layout")}
  onOk={deleteLayout}
/>

<Modal bind:this={editLayoutNameModal}>
  <ModalContent
    title={$t("edit-layout-name")}
    confirmText={$t("save")}
    onConfirm={saveLayout}
    disabled={!name}
  >
    <Input thin type="text" label={$t("name")} bind:value={name} />
  </ModalContent>
</Modal>
