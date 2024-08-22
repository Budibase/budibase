<script>
  import { ActionButton, Menu, MenuItem, notifications } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { automationStore, tables, builderStore } from "stores/builder"
  import { TriggerStepID } from "constants/backend/automations"
  import { goto } from "@roxi/routify"
  import DetailPopover from "components/common/DetailPopover.svelte"
  import MagicWand from "./magic-wand.svg"

  const { datasource } = getContext("grid")

  let popover

  $: triggers = $automationStore.blockDefinitions.CREATABLE_TRIGGER
  $: table = $tables.list.find(table => table._id === $datasource.tableId)

  export const show = () => popover?.show()
  export const hide = () => popover?.hide()

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
</script>

<DetailPopover title="Generate" bind:this={popover}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton selected={open}>
      <div class="center">
        <img height={16} alt="magic wand" src={MagicWand} />
        Generate
      </div>
    </ActionButton>
  </svelte:fragment>
  <div class="menu">
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
  </div>
</DetailPopover>

<style>
  .menu {
    margin: 0 calc(-1 * var(--spacing-xl));
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .center {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
