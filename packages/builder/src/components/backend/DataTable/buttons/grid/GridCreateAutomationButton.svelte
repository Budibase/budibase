<script>
  import {
    ActionButton,
    Popover,
    Menu,
    MenuItem,
    notifications,
  } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { automationStore, tables, builderStore } from "stores/builder"
  import { TriggerStepID } from "constants/backend/automations"
  import { goto } from "@roxi/routify"

  const { datasource } = getContext("grid")

  $: triggers = $automationStore.blockDefinitions.CREATABLE_TRIGGER

  $: table = $tables.list.find(table => table._id === $datasource.tableId)

  async function createAutomation(type) {
    const triggerType = triggers[type]
    if (!triggerType) {
      console.error("Invalid trigger type", type)
      notifications.error("Invalid automation trigger type")
      return
    }

    if (!table) {
      notifications.error("Invalid table, cannot create automation")
      return
    }

    const automationName = `${table.name} : Row ${
      type === TriggerStepID.ROW_SAVED ? "created" : "updated"
    }`
    const triggerBlock = automationStore.actions.constructBlock(
      "TRIGGER",
      triggerType.stepId,
      triggerType
    )

    triggerBlock.inputs = { tableId: $datasource.tableId }

    try {
      const response = await automationStore.actions.create(
        automationName,
        triggerBlock
      )
      builderStore.setPreviousTopNavPath(
        "/builder/app/:application/data",
        window.location.pathname
      )
      $goto(`/builder/app/${response.appId}/automation/${response.id}`)
      notifications.success(`Automation created`)
    } catch (e) {
      console.error("Error creating automation", e)
      notifications.error("Error creating automation")
    }
  }

  let anchor
  let open
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="MagicWand"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={open}
  >
    Generate
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <Menu>
    <MenuItem
      icon="ShareAndroid"
      on:click={() => {
        open = false
        createAutomation(TriggerStepID.ROW_SAVED)
      }}
    >
      Automation: when row is created
    </MenuItem>
    <MenuItem
      icon="ShareAndroid"
      on:click={() => {
        open = false
        createAutomation(TriggerStepID.ROW_UPDATED)
      }}
    >
      Automation: when row is updated
    </MenuItem>
  </Menu>
</Popover>

<style>
</style>
