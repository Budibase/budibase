<script>
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { queries } from "stores/backend"
  import { _ as t } from "svelte-i18n"

  export let query

  let confirmDeleteDialog

  async function deleteQuery() {
    await queries.delete(query)
    notifications.success($t("query-deleted"))
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$t("delete")}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={$t("delete-query")}
  onOk={deleteQuery}
  title={$t("confirm-deletion-0")}
>
  {$t(
    "are-you-sure-you-wish-to-delete-this-query-this-action-cannot-be-undone"
  )}
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
