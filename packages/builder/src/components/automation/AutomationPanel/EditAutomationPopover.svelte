<script>
  import { goto } from "@roxi/routify"
  import { automationStore } from "builderStore"
  import { ActionMenu, MenuItem, notifications, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UpdateAutomationModal from "components/automation/AutomationPanel/UpdateAutomationModal.svelte"

  export let automation

  let confirmDeleteDialog
  let updateAutomationDialog

  async function deleteAutomation() {
    await automationStore.actions.delete(automation)
    notifications.success("Automation deleted.")
    $goto("../automate")
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={updateAutomationDialog.show}>Edit</MenuItem>
  <MenuItem icon="Delete" on:click={confirmDeleteDialog.show}>Delete</MenuItem>
</ActionMenu>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Automation"
  onOk={deleteAutomation}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the automation
  <i>{automation.name}?</i>
  This action cannot be undone.
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
