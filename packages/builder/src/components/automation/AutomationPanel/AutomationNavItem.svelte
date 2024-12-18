<script>
  import {
    selectedAutomation,
    userSelectedResourceMap,
    automationStore,
    contextMenuStore,
  } from "@/stores/builder"
  import { notifications, Icon } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import UpdateAutomationModal from "@/components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import NavItem from "@/components/common/NavItem.svelte"

  export let automation
  export let icon

  let confirmDeleteDialog
  let updateAutomationDialog

  $: isRowAction = sdk.automations.isRowAction(automation)

  async function deleteAutomation() {
    try {
      await automationStore.actions.delete(automation)
      notifications.success("Automation deleted successfully")
    } catch (error) {
      console.error(error)
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
    const pause = {
      icon: automation.disabled ? "CheckmarkCircle" : "Cancel",
      name: automation.disabled ? "Activate" : "Pause",
      keyBind: null,
      visible: true,
      disabled: !automation.definition.trigger,
      callback: () => {
        automationStore.actions.toggleDisabled(
          automation._id,
          automation.disabled
        )
      },
    }
    const del = {
      icon: "Delete",
      name: "Delete",
      keyBind: null,
      visible: true,
      disabled: false,
      callback: confirmDeleteDialog.show,
    }
    if (!isRowAction) {
      return [
        {
          icon: "Edit",
          name: "Edit",
          keyBind: null,
          visible: true,
          disabled: !automation.definition.trigger,
          callback: updateAutomationDialog.show,
        },
        {
          icon: "Duplicate",
          name: "Duplicate",
          keyBind: null,
          visible: true,
          disabled:
            !automation.definition.trigger ||
            automation.definition.trigger?.name === "Webhook",
          callback: duplicateAutomation,
        },
        pause,
        del,
      ]
    } else {
      return [
        {
          icon: "Edit",
          name: "Edit",
          keyBind: null,
          visible: true,
          callback: updateAutomationDialog.show,
        },
        del,
      ]
    }
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
  iconColor={automation.disabled
    ? "var(--spectrum-global-color-gray-600)"
    : "var(--spectrum-global-color-gray-900)"}
  text={automation.name}
  selected={automation._id === $selectedAutomation?.data?._id}
  hovering={automation._id === $contextMenuStore.id}
  on:click={() => automationStore.actions.select(automation._id)}
  selectedBy={$userSelectedResourceMap[automation._id]}
  disabled={automation.disabled}
>
  <Icon on:click={openContextMenu} size="S" hoverable name="MoreSmallList" />
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
