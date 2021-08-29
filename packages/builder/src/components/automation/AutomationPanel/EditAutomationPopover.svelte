<script>
  import { goto } from "@roxi/routify"
  import { automationStore } from "builderStore"
  import { database } from "stores/backend"
  import { ActionMenu, MenuItem, notifications, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { _ as t } from "svelte-i18n"

  export let automation

  let confirmDeleteDialog
  $: instanceId = $database._id

  async function deleteAutomation() {
    await automationStore.actions.delete({
      instanceId,
      automation,
    })
    notifications.success($t("automation-deleted"))
    $goto("../automate")
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem noClose icon="Delete" on:click={confirmDeleteDialog.show}>
    {$t("delete")}
  </MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={$t("delete-automation")}
  onOk={deleteAutomation}
  title={$t("confirm-deletion-0")}
>
  {$t("are-you-sure-you-wish-to-delete-the-automation")}
  <i>{automation.name}?</i>
  {$t("this-action-cannot-be-undone")}
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
