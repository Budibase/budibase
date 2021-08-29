<script>
  import { goto } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { ActionMenu, MenuItem, Icon, notifications } from "@budibase/bbui"
  import { _ as t } from "svelte-i18n"

  export let screenId

  let confirmDeleteDialog

  $: screen = $allScreens.find(screen => screen._id === screenId)

  const deleteScreen = async () => {
    try {
      await store.actions.screens.delete(screen)
      await store.actions.routing.fetch()
      $goto("../")
      notifications.success($t('deleted-screen-successfully'))
    } catch (err) {
      notifications.error($t('error-deleting-screen'))
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>{ $t('delete') }</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  title={ $t('confirm-deletion') }
  body={$t('are-you-sure-you-wish-to-delete-this-screen')}
  okText={ $t('delete-screen') }
  onOk={deleteScreen}
/>
