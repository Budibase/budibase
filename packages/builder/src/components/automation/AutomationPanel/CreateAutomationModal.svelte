<script>
  import { goto } from "@roxi/routify"
  import { database } from "stores/backend"
  import { automationStore } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import { Input, ModalContent, Layout, Body, Icon } from "@budibase/bbui"
  import analytics from "analytics"

  let name
  let selectedTrigger
  let triggerVal
  export let webhookModal

  $: instanceId = $database._id

  async function createAutomation() {
    await automationStore.actions.create({
      name,
      instanceId,
    })
    const newBlock = $automationStore.selectedAutomation.constructBlock(
      "TRIGGER",
      triggerVal.stepId,
      triggerVal
    )

    automationStore.actions.addBlockToAutomation(newBlock)
    if (triggerVal.stepId === "WEBHOOK") {
      webhookModal.show
    }

    await automationStore.actions.save(
      $automationStore.selectedAutomation?.automation
    )

    notifications.success(`Automation ${name} created.`)

    $goto(`./${$automationStore.selectedAutomation.automation._id}`)
    analytics.captureEvent("Automation Created", { name })
  }
  $: triggers = Object.entries($automationStore.blockDefinitions.TRIGGER)

  const selectTrigger = trigger => {
    triggerVal = trigger
    selectedTrigger = trigger.name
  }
</script>

<ModalContent
  title="Create Automation"
  confirmText="Save"
  size="M"
  onConfirm={createAutomation}
  disabled={!selectedTrigger}
>
  <Body size="XS"
    >Please name your automation, then select a trigger. Every automation must
    start with a trigger.
  </Body>
  <Input bind:value={name} label="Name" />

  <Layout noPadding>
    <Body size="S">Triggers</Body>

    <div class="item-list">
      {#each triggers as [idx, trigger]}
        <div
          class="item"
          class:selected={selectedTrigger === trigger.name}
          on:click={() => selectTrigger(trigger)}
        >
          <div class="item-body">
            <Icon name={trigger.icon} />
            <span class="icon-spacing">
              <Body size="S">{trigger.name}</Body></span
            >
          </div>
        </div>
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .icon-spacing {
    margin-left: var(--spacing-m);
  }
  .item-body {
    display: flex;
    margin-left: var(--spacing-m);
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    display: grid;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid #3b3d3c;
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
  }
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
