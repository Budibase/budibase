<script>
  import { _ } from "../../../../../../../../../../lang/i18n"
  import { store } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let layout

  let confirmDeleteDialog

  const deleteLayout = async () => {
    try {
      await store.actions.layouts.delete(layout)
      notifications.success(
        $_(
          "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutDropdownMenu.Layout_deleted"
        )
      )
    } catch (err) {
      notifications.error(
        err?.message ||
          $_(
            "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutDropdownMenu.Error_deleting"
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
      "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutDropdownMenu.Delete"
    )}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title={$_(
    "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutDropdownMenu.Confirm_Deletion"
  )}
  body={$_(
    "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutDropdownMenu.wish_delete"
  )}
  okText={$_(
    "pages.builder.app.application.design.screenId.layouts.layoutsId._components.LayoutDropdownMenu.Delete_layout"
  )}
  onOk={deleteLayout}
/>

<style>
  .icon {
    display: grid;
    place-items: center;
  }
</style>
