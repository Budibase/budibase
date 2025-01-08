<script>
  import { ActionButton, ListItem, notifications } from "@budibase/bbui"
  import { getContext } from "svelte"
  import {
    automationStore,
    tables,
    builderStore,
    viewsV2,
  } from "@/stores/builder"
  import { TriggerStepID } from "@/constants/backend/automations"
  import { goto } from "@roxi/routify"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import MagicWand from "./magic-wand.svg"
  import { AutoScreenTypes } from "@/constants"
  import CreateScreenModal from "@/pages/builder/app/[application]/design/_components/NewScreen/CreateScreenModal.svelte"
  import { getSequentialName } from "@/helpers/duplicate"

  const { datasource } = getContext("grid")

  let popover
  let createScreenModal

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

    const suffixMap = {
      [TriggerStepID.ROW_SAVED]: "created",
      [TriggerStepID.ROW_UPDATED]: "updated",
      [TriggerStepID.ROW_DELETED]: "deleted",
    }
    const namePrefix = `Row ${suffixMap[type]} `
    const automationName = getSequentialName(
      $automationStore.automations,
      namePrefix,
      {
        getName: x => x.name,
      }
    )
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
      $goto(`/builder/app/${response.appId}/automation/${response._id}`)
      notifications.success(`Automation created successfully`)
    } catch (e) {
      console.error(e)
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
    <ActionButton quiet selected={open}>
      <div class="center">
        <img height={16} alt="magic wand" src={MagicWand} />
        Generate
      </div>
    </ActionButton>
  </svelte:fragment>

  {#if $datasource.type === "table"}
    Generate a new app screen or automation from this data.
  {:else}
    Generate a new app screen from this data.
  {/if}

  <div class="generate-section">
    <div class="generate-section__title">App screens</div>
    <div class="generate-section__options">
      <div>
        <ListItem
          title="Table"
          icon="TableEdit"
          hoverable
          on:click={() => startScreenWizard(AutoScreenTypes.TABLE)}
          iconColor="var(--spectrum-global-color-gray-600)"
        />
      </div>
      <div>
        <ListItem
          title="Form"
          icon="Form"
          hoverable
          on:click={() => startScreenWizard(AutoScreenTypes.FORM)}
          iconColor="var(--spectrum-global-color-gray-600)"
        />
      </div>
    </div>
  </div>

  {#if $datasource.type === "table"}
    <div class="generate-section">
      <div class="generate-section__title">Automation triggers (When a...)</div>
      <div class="generate-section__options">
        <div>
          <ListItem
            title="Row is created"
            icon="TableRowAddBottom"
            hoverable
            on:click={() => createAutomation(TriggerStepID.ROW_SAVED)}
            iconColor="var(--spectrum-global-color-gray-600)"
          />
        </div>
        <div>
          <ListItem
            title="Row is updated"
            icon="Refresh"
            hoverable
            on:click={() => createAutomation(TriggerStepID.ROW_UPDATED)}
            iconColor="var(--spectrum-global-color-gray-600)"
          />
        </div>
        <div>
          <ListItem
            title="Row is deleted"
            icon="TableRowRemoveCenter"
            hoverable
            on:click={() => createAutomation(TriggerStepID.ROW_DELETED)}
            iconColor="var(--spectrum-global-color-gray-600)"
          />
        </div>
      </div>
    </div>
  {/if}
</DetailPopover>

<CreateScreenModal bind:this={createScreenModal} />

<style>
  .center {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .generate-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .generate-section__title {
    color: var(--spectrum-global-color-gray-600);
  }
  .generate-section__options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 16px;
    grid-row-gap: 8px;
  }
</style>
