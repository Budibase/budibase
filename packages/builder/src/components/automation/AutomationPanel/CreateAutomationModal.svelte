<script>
  import { automationStore } from "builderStore"
  import { notifications } from "@budibase/bbui"
  import {
    Input,
    InlineAlert,
    ModalContent,
    Layout,
    Body,
    Icon,
    Label,
  } from "@budibase/bbui"
  import { TriggerStepID } from "constants/backend/automations"
  import { _ } from "../../../../lang/i18n"

  export let webhookModal

  let name
  let selectedTrigger
  let nameTouched = false
  let triggerVal

  $: nameError =
    nameTouched && !name
      ? $_(
          "components.automation.AutomationPanel.CreateAutomationModal.specify"
        )
      : null
  $: triggers = Object.entries($automationStore.blockDefinitions.TRIGGER)

  async function createAutomation() {
    try {
      const trigger = automationStore.actions.constructBlock(
        "TRIGGER",
        triggerVal.stepId,
        triggerVal
      )
      await automationStore.actions.create(name, trigger)
      if (triggerVal.stepId === TriggerStepID.WEBHOOK) {
        webhookModal.show()
      }
      notifications.success(
        `${$_(
          "components.automation.AutomationPanel.CreateAutomationModal.Automation"
        )} ${name} ${$_(
          "components.automation.AutomationPanel.CreateAutomationModal.created"
        )}`
      )
    } catch (error) {
      notifications.error(
        $_(
          "components.automation.AutomationPanel.CreateAutomationModal.Error_creating"
        )
      )
    }
  }

  const selectTrigger = trigger => {
    triggerVal = trigger
    selectedTrigger = trigger.name
  }
</script>

<ModalContent
  title={$_(
    "components.automation.AutomationPanel.CreateAutomationModal.Create_Automation"
  )}
  confirmText={$_(
    "components.automation.AutomationPanel.CreateAutomationModal.Save"
  )}
  size="M"
  onConfirm={createAutomation}
  disabled={!selectedTrigger || !name}
>
  <InlineAlert
    header={$_(
      "components.automation.AutomationPanel.CreateAutomationModal.must_publish"
    )}
    message={$_(
      "components.automation.AutomationPanel.CreateAutomationModal.test_automation"
    )}
  />
  <Body size="S">
    {$_(
      "components.automation.AutomationPanel.CreateAutomationModal.name_automation"
    )}<br />
    {$_(
      "components.automation.AutomationPanel.CreateAutomationModal.automation_start"
    )}
  </Body>
  <Input
    bind:value={name}
    on:input={() => (nameTouched = true)}
    bind:error={nameError}
    label="Name"
  />

  <Layout noPadding gap="XS">
    <Label size="S"
      >{$_(
        "components.automation.AutomationPanel.CreateAutomationModal.Devil_Trigger"
      )}</Label
    >
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
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
  }

  .item:hover {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
