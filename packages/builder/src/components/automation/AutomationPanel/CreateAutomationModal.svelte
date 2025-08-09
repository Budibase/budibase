<script>
  import { goto } from "@roxi/routify"
  import { automationStore } from "@/stores/builder"
  import {
    notifications,
    Input,
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
  title="Create new automation"
  confirmText="Save"
  size="M"
  onConfirm={createAutomation}
  disabled={!selectedTrigger || !name}
>
  <Input
    bind:value={name}
    on:input={() => (nameTouched = true)}
    bind:error={nameError}
    label="Name"
  />

  <Layout noPadding gap="XS">
    <Label size="S">Select a trigger</Label>
    <div class="item-list">
      {#each triggers as [_, trigger]}
        <div
          class="item"
          class:selected={selectedTrigger === trigger.name}
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
        </div>
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .item-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    border-radius: 8px;
    padding: var(--spacing-s) var(--spacing-m);
    border: 0.5px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-global-color-gray-50);
    transition: 0.1s all;
    box-sizing: border-box;
  }

  .icon-container {
    background-color: #215f9e;
    border: 0.5px solid #467db4;
    padding: 4px;
    border-radius: 8px;
  }

  .item:hover {
    background: var(--spectrum-global-color-gray-75);
  }
  .selected {
    background: var(--spectrum-global-color-gray-75);
    border: 0.5px solid var(--spectrum-global-color-blue-600);
  }
</style>
