<script>
  import { automationStore } from "builderStore"
  import { ActionMenu, MenuItem, notifications, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UpdateAutomationModal from "components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import { _ } from "../../../../lang/i18n"

  export let automation

  let confirmDeleteDialog
  let updateAutomationDialog

  async function deleteAutomation() {
    try {
      await automationStore.actions.delete(automation)
      notifications.success(
        $_(
          "components.automation.AutomationPanel.EditAtuomationPopover.Automation_deleted"
        )
      )
    } catch (error) {
      notifications.error(
        $_(
          "components.automation.AutomationPanel.EditAtuomationPopover.Error_deleting"
        )
      )
    }
  }

  async function duplicateAutomation() {
    try {
      await automationStore.actions.duplicate(automation)
      notifications.success(
        $_(
          "components.automation.AutomationPanel.EditAtuomationPopover.Automation_duplicated"
        )
      )
    } catch (error) {
      notifications.error(
        $_(
          "components.automation.AutomationPanel.EditAtuomationPopover.Error_duplicating"
        )
      )
    }
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Duplicate" on:click={duplicateAutomation}
    >{$_(
      "components.automation.AutomationPanel.EditAtuomationPopover.Duplicate"
    )}</MenuItem
  >
  <MenuItem icon="Edit" on:click={updateAutomationDialog.show}
    >{$_(
      "components.automation.AutomationPanel.EditAtuomationPopover.Edit"
    )}</MenuItem
  >
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}
    >{$_(
      "components.automation.AutomationPanel.EditAtuomationPopover.Delete"
    )}</MenuItem
  >
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={$_(
    "components.automation.AutomationPanel.EditAtuomationPopover.Delete_Automation"
  )}
  onOk={deleteAutomation}
  title={$_(
    "components.automation.AutomationPanel.EditAtuomationPopover.Confirm_Deletion"
  )}
>
  {$_(
    "components.automation.AutomationPanel.EditAtuomationPopover.wish_delete"
  )}
  <i>{automation.name}?</i>
  {$_("components.automation.AutomationPanel.EditAtuomationPopover.undone.")}
</ConfirmDialog>
<UpdateAutomationModal {automation} bind:this={updateAutomationDialog} />

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
