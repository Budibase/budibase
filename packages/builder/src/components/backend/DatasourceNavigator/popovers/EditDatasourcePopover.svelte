<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UpdateDatasourceModal from "components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import { _ as t } from "svelte-i18n"

  export let datasource

  let confirmDeleteDialog
  let updateDatasourceDialog

  async function deleteDatasource() {
    const wasSelectedSource = $datasources.selected
    await datasources.delete(datasource)
    notifications.success($t("datasource-deleted"))
    // navigate to first index page if the source you are deleting is selected
    if (wasSelectedSource === datasource._id) {
      $goto("./datasource")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={updateDatasourceDialog.show}
    >{$t("edit")}</MenuItem
  >
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$t("delete")}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={$t("delete-datasource")}
  onOk={deleteDatasource}
  title={$t("confirm-deletion-0")}
>
  {$t("are-you-sure-you-wish-to-delete-the-datasource")}
  <i>{datasource.name}?</i>
  {$t("this-action-cannot-be-undone")}
</ConfirmDialog>
<UpdateDatasourceModal {datasource} bind:this={updateDatasourceDialog} />

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
