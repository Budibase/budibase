<script>
  import { goto } from "@roxi/routify"
  import { automationStore } from "stores/builder"
  import {
    notifications,
    Input,
    InlineAlert,
    ModalContent,
    Layout,
    Body,
    Icon,
    Label,
  } from "@budibase/bbui"
  import { TriggerStepID } from "constants/backend/automations"

  export let webhookModal

  let name
  let selectedTrigger
  let nameTouched = false
  let triggerVal

  $: nameError =
    nameTouched && !name ? "Please specify a name for the automation." : null
  $: triggers = Object.entries(
    $automationStore.blockDefinitions.CREATABLE_TRIGGER
  )

  async function createAutomation() {
    try {
      const trigger = automationStore.actions.constructBlock(
        "TRIGGER",
        triggerVal.stepId,
        triggerVal
      )
      const automation = await automationStore.actions.create(name, trigger)
      if (triggerVal.stepId === TriggerStepID.WEBHOOK) {
        webhookModal.show()
      }
      notifications.success(`Automation ${name} created`)
      $goto(`../automation/${automation._id}`)
    } catch (error) {
      notifications.error("Error creating automation")
    }
  }

  const selectTrigger = trigger => {
    triggerVal = trigger
    selectedTrigger = trigger.name
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ModalContent
  title="Create Automation"
  confirmText="Save"
  size="M"
  onConfirm={createAutomation}
  disabled={!selectedTrigger || !name}
>
  <InlineAlert header="Click Publish to activate your automation." />
  <Input
    bind:value={name}
    on:input={() => (nameTouched = true)}
    bind:error={nameError}
    placeholder="Name your automation"
  />

  <Layout noPadding gap="XS">
    <Label size="L">Trigger</Label>
    <div class="item-list">
      {#each triggers as [_, trigger]}
        <div
          class="item"
          class:selected={selectedTrigger === trigger.name}
          on:click={() => selectTrigger(trigger)}
        >
          <div class="item-body">
            <div class="icon-background-trigger">
              <Icon name={trigger.icon} />
            </div>
            <Body size="S">{trigger.name}</Body>
          </div>
        </div>
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .item-body {
    display: flex;
    margin-left: var(--spacing-xs);
    gap: var(--spacing-m);
    align-items: center;
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(200px, 1fr));
    grid-gap: 10px;
  }
  .item {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    box-sizing: border-box;
    border-width: 1px;
  }

  .item:not(.disabled):hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .icon-background-trigger {
    background-color: #ffd230;
    /*background-color: #6afdef;*/
    padding: 0;
    border-radius: 6px;
    min-height: 28px;
    min-width: 28px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  div:has(svg) {
    color: black;
  }
</style>
