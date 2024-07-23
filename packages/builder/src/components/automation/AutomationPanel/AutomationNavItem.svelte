<script>
  import {
    selectedAutomation,
    userSelectedResourceMap,
    automationStore,
    contextMenuStore,
  } from "stores/builder"
  import { notifications, Icon } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import UpdateAutomationModal from "components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import NavItem from "components/common/NavItem.svelte"

  export let automation
  export let icon

  let confirmDeleteDialog
  let updateAutomationDialog

  async function deleteAutomation() {
    try {
      await automationStore.actions.delete(automation)
      notifications.success("Automation deleted successfully")
    } catch (error) {
      notifications.error("Error deleting automation")
    }
  }

  async function duplicateAutomation() {
    try {
      await automationStore.actions.duplicate(automation)
      notifications.success("Automation has been duplicated successfully")
    } catch (error) {
      notifications.error("Error duplicating automation")
    }
  }

  const getContextMenuItems = () => {
    const isRowAction = sdk.automations.isRowAction(automation)
    const result = []
    if (!isRowAction) {
      result.push(
        ...[
          {
            icon: "Delete",
            name: "Delete",
            keyBind: null,
            visible: true,
            disabled: false,
            callback: confirmDeleteDialog.show,
          },
          {
            icon: "Edit",
            name: "Edit",
            keyBind: null,
            visible: true,
            disabled: false,
            callback: updateAutomationDialog.show,
          },
          {
            icon: "Duplicate",
            name: "Duplicate",
            keyBind: null,
            visible: true,
            disabled: automation.definition.trigger.name === "Webhook",
            callback: duplicateAutomation,
          },
        ]
      )
    }

    result.push({
      icon: automation.disabled ? "CheckmarkCircle" : "Cancel",
      name: automation.disabled ? "Activate" : "Pause",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: () => {
        automationStore.actions.toggleDisabled(
          automation._id,
          automation.disabled
        )
      },
    })
    return result
  }

  const openContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(automation._id, items, { x: e.clientX, y: e.clientY })
  }
</script>

<NavItem
  on:contextmenu={openContextMenu}
  {icon}
  iconColor={"var(--spectrum-global-color-gray-900)"}
  text={automation.displayName}
  selected={automation._id === $selectedAutomation?._id}
  hovering={automation._id === $contextMenuStore.id}
  on:click={() => automationStore.actions.select(automation._id)}
  selectedBy={$userSelectedResourceMap[automation._id]}
  disabled={automation.disabled}
>
  <div class="icon">
    <Icon on:click={openContextMenu} size="S" hoverable name="MoreSmallList" />
  </div>
</NavItem>

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
