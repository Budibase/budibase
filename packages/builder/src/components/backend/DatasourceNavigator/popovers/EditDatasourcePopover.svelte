<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UpdateDatasourceModal from "components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import { BUDIBASE_DATASOURCE_TYPE } from "constants/backend"
  import { _ } from "../../../../../lang/i18n"

  export let datasource

  let confirmDeleteDialog
  let updateDatasourceDialog

  async function deleteDatasource() {
    try {
      const isSelected = datasource.selected || datasource.containsSelected
      await datasources.delete(datasource)
      notifications.success(
        $_(
          "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.Datasource_deleted"
        )
      )
      if (isSelected) {
        $goto("./datasource")
      }
    } catch (error) {
      notifications.error(
        $_(
          "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.Error_deleting"
        )
      )
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  {#if datasource.type !== BUDIBASE_DATASOURCE_TYPE}
    <MenuItem icon="Edit" on:click={updateDatasourceDialog.show}
      >{$_(
        "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.Edit"
      )}</MenuItem
    >
  {/if}
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$_(
      "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.Delete"
    )}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={$_(
    "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.Delete_Datasource"
  )}
  onOk={deleteDatasource}
  title={$_(
    "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.Confirm_Deletion"
  )}
>
  {$_(
    "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.wish_delete"
  )}
  <i>{datasource.name}?</i>
  {$_(
    "components.backend.DatasourceNavigation.popovers.EditDatasourcePopover.undone"
  )}
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
