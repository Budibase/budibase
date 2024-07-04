<script>
  import {
    ActionButton,
    Popover,
    Menu,
    MenuItem,
    notifications,
  } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { automationStore } from "stores/builder"
  import { TriggerStepID } from "constants/backend/automations"
  import { tables } from "stores/builder"
  import { goto } from "@roxi/routify"

  const { datasource } = getContext("grid")

  // ROW_SAVED
  // ROW_UPDATED
  $: console.log($datasource)
  $: triggers = $automationStore.blockDefinitions.TRIGGER

  $: table = $tables.list.find(table => table._id === $datasource.tableId)
  $: console.log("table", table)
  // $: rowCreateTrigger = triggers[TriggerStepID.ROW_SAVED]
  // $: rowUpdateTrigger = triggers[TriggerStepID.ROW_UPDATED]

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

    // need to set inputs to { "tableId": "ta_bb_employee" },

    try {
      console.log("REQ", {
        automationName,
        triggerBlock,
      })
      const response = await automationStore.actions.create(
        automationName,
        triggerBlock
      )

      $goto(`/builder/app/${response.appId}/automation/${response.id}`)
      notifications.success(`Automation created`)
    } catch {
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
        console.log("create")
      }}
    >
      Automation: when row is created
    </MenuItem>
    <MenuItem
      icon="ShareAndroid"
      on:click={() => {
        open = false
        createAutomation(TriggerStepID.ROW_UPDATED)
        console.log("update")
      }}
    >
      Automation: when row is updated
    </MenuItem>
  </Menu>
</Popover>

<style>
</style>
