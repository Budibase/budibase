<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UpdateDatasourceModal from "components/backend/DatasourceNavigator/modals/UpdateDatasourceModal.svelte"
  import { BUDIBASE_DATASOURCE_TYPE } from "constants/backend"

  export let datasource

  let confirmDeleteDialog
  let updateDatasourceDialog

  async function deleteDatasource() {
    try {
      const isSelected = datasource.selected || datasource.containsSelected
      await datasources.delete(datasource)
      notifications.success("Datasource deleted")
      if (isSelected) {
        $goto("./datasource")
      }
    } catch (error) {
      notifications.error("Error deleting datasource")
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  {#if datasource.type !== BUDIBASE_DATASOURCE_TYPE}
    <MenuItem icon="Edit" on:click={updateDatasourceDialog.show}>Edit</MenuItem>
  {/if}
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Datasource"
  onOk={deleteDatasource}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the datasource
  <i>{datasource.name}?</i>
  This action cannot be undone.
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
