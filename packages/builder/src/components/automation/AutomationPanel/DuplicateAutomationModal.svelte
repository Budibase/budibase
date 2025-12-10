<script>
  import { automationStore } from "@/stores/builder"
  import { cloneDeep } from "lodash/fp"
  import {
    notifications,
    Icon,
    ModalContent,
    Label,
    Layout,
    Body,
  } from "@budibase/bbui"

  export let automation
  export let onDuplicateSuccess = () => {}

  let triggerVal
  let selectedTriggerId

  $: triggers = Object.entries(
    $automationStore.blockDefinitions.CREATABLE_TRIGGER
  )

  $: if (automation && !selectedTriggerId) {
    selectedTriggerId = automation.definition.trigger?.stepId
    triggerVal =
      $automationStore.blockDefinitions.CREATABLE_TRIGGER[selectedTriggerId] ||
      triggers[0]?.[1]
    if (triggerVal) {
      selectedTriggerId = triggerVal.stepId
    }
  }

  function selectTrigger(trigger) {
    selectedTriggerId = trigger.stepId
    triggerVal = trigger
  }

  async function duplicateAutomation() {
    if (!automation || !triggerVal) {
      return
    }
    try {
      const newTrigger = automationStore.actions.constructBlock(
        "TRIGGER",
        triggerVal.stepId,
        triggerVal
      )
      if (
        automation.definition.trigger?.stepId === triggerVal.stepId &&
        automation.definition.trigger?.inputs
      ) {
        newTrigger.inputs = cloneDeep(automation.definition.trigger.inputs)
      }
      const duplicatedAutomation = {
        ...automation,
        definition: {
          ...automation.definition,
          trigger: newTrigger,
        },
      }
      await automationStore.actions.duplicate(duplicatedAutomation)
      notifications.success("Automation duplicated successfully")
      onDuplicateSuccess()
    } catch (error) {
      notifications.error("Error duplicating automation")
    }
  }
</script>

<ModalContent
  title="Duplicate automation"
  size="M"
  confirmText="Duplicate"
  onConfirm={duplicateAutomation}
  disabled={!triggerVal}
>
  <Layout noPadding gap="XS">
    <Label size="S">Select a trigger</Label>
    <div class="item-list">
      {#each triggers as [, trigger]}
        <button
          type="button"
          class="item"
          class:selected={selectedTriggerId === trigger.stepId}
          on:click={() => selectTrigger(trigger)}
        >
          <div class="icon-container">
            <Icon
              name={trigger.icon}
              size="M"
              color="var(--spectrum-global-color-static-gray-50)"
            />
          </div>
          <Body size="S">{trigger.name}</Body>
        </button>
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .item-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    border: none;
    border-radius: 12px;
    padding: var(--spacing-s) var(--spacing-m);
    font: inherit;
    text-align: left;
    color: inherit;
    background: #0f1116;
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition:
      border 0.2s,
      background 0.2s;
  }

  .item:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-600);
    outline-offset: 2px;
  }

  .item.selected {
    border-color: var(--spectrum-global-color-blue-600);
    background: #1a1e27;
  }

  .icon-container {
    background-color: #275b9f;
    border: 1px solid #467db4;
    padding: 6px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
