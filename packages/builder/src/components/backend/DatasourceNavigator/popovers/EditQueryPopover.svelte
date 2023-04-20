<script>
  import { goto } from "@roxi/routify"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { datasources, queries } from "stores/backend"
  import { _ } from "../../../../../lang/i18n"

  export let query

  let confirmDeleteDialog

  async function deleteQuery() {
    try {
      // Go back to the datasource if we are deleting the active query
      if ($queries.selectedQueryId === query._id) {
        $goto(`./datasource/${query.datasourceId}`)
      }
      await queries.delete(query)
      await datasources.fetch()
      notifications.success(
        $_(
          "components.backend.DatasourceNavigation.popovers.EditQueryPopover.Query_deleted"
        )
      )
    } catch (error) {
      notifications.error(
        $_(
          "components.backend.DatasourceNavigation.popovers.EditQueryPopover.Error_deleting"
        )
      )
    }
  }

  async function duplicateQuery() {
    try {
      const newQuery = await queries.duplicate(query)
      $goto(`./query/${newQuery._id}`)
    } catch (error) {
      notifications.error(
        $_(
          "components.backend.DatasourceNavigation.popovers.EditQueryPopover.Error_duplicating"
        )
      )
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$_(
      "components.backend.DatasourceNavigation.popovers.EditQueryPopover.Delete"
    )}</MenuItem
  >
  <MenuItem icon="Duplicate" on:click={duplicateQuery}
    >{$_(
      "components.backend.DatasourceNavigation.popovers.EditQueryPopover.Duplicate"
    )}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={$_(
    "components.backend.DatasourceNavigation.popovers.EditQueryPopover.Delete_Query"
  )}
  onOk={deleteQuery}
  title={$_(
    "components.backend.DatasourceNavigation.popovers.EditQueryPopover.Confirm_Deletion"
  )}
>
  {$_(
    "components.backend.DatasourceNavigation.popovers.EditQueryPopover.wish_delete"
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
