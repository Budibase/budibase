<script>
  import { goto } from "@roxi/routify"
  import { automationStore } from "builderStore"
  import { database } from "stores/backend"
  import { ActionMenu, MenuItem, notifications, Icon } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let automation

  let confirmDeleteDialog
  $: instanceId = $database._id

  async function deleteAutomation() {
    await automationStore.actions.delete({
      instanceId,
      automation,
    })
    notifications.success("Automation deleted.")
    $goto("../automate")
  }
</script>

<ActionMenu let:open let:closeOnClick>
  <div slot="button" class="icon" on:click={open}>
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Delete" on:click={closeOnClick(confirmDeleteDialog.show)}
    >Delete</MenuItem
  >
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

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  div.icon i {
    font-size: 16px;
  }
</style>
