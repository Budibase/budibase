<script>
  import { ActionButton, Menu, MenuItem, notifications } from "@budibase/bbui"
  import { getContext } from "svelte"
  import {
    automationStore,
    tables,
    builderStore,
    viewsV2,
  } from "stores/builder"
  import { TriggerStepID } from "constants/backend/automations"
  import { goto } from "@roxi/routify"
  import DetailPopover from "components/common/DetailPopover.svelte"
  import MagicWand from "./magic-wand.svg"
  import { AutoScreenTypes } from "constants"
  import CreateScreenModal from "pages/builder/app/[application]/design/_components/NewScreen/CreateScreenModal.svelte"

  const { datasource } = getContext("grid")

  let popover
  let createScreenModal
  let isCreatingScreen

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

  const startScreenWizard = autoScreenType => {
    popover.hide()
    let preSelected
    if ($datasource.type === "table") {
      preSelected = $tables.list.find(x => x._id === $datasource.tableId)
    } else {
      preSelected = $viewsV2.list.find(x => x.id === $datasource.id)
    }
    createScreenModal.show(autoScreenType, preSelected)
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
      <MenuItem
        icon="WebPage"
        on:click={() => {
          open = false
          startScreenWizard(AutoScreenTypes.TABLE)
        }}
      >
        CRUD app
      </MenuItem>
      <MenuItem
        icon="WebPage"
        on:click={() => {
          open = false
          startScreenWizard(AutoScreenTypes.FORM)
        }}
      >
        Form
      </MenuItem>
    </Menu>
  </div>
</DetailPopover>

<CreateScreenModal bind:this={createScreenModal} />

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
