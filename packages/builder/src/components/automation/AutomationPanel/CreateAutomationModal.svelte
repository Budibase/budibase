<script>
  import { goto } from "@roxi/routify"
  import { automationStore } from "@/stores/builder"
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
  import { TriggerStepID } from "@/constants/backend/automations"

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
  <InlineAlert
    header="You must publish your app to activate your automations."
    message="To test your automation before publishing, you can use the 'Run Test' functionality on the next screen."
  />
  <Body size="S">
    Please name your automation, then select a trigger.<br />
    Every automation must start with a trigger.
  </Body>
  <Input
    bind:value={name}
    on:input={() => (nameTouched = true)}
    bind:error={nameError}
    label="Name"
  />

  <Layout noPadding gap="XS">
    <Label size="S">Trigger</Label>
    <div class="item-list">
      {#each triggers as [_, trigger]}
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
