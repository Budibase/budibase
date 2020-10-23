<script>
  import { backendUiStore, automationStore } from "builderStore"
  import CreateWebookModal from "./CreateWebhookModal.svelte"
  import analytics from "analytics"
  import { Modal } from "@budibase/bbui"

  export let blockDefinition
  export let stepId
  export let blockType

  let modal

  $: blockDefinitions = $automationStore.blockDefinitions
  $: instanceId = $backendUiStore.selectedDatabase._id
  $: automation = $automationStore.selectedAutomation?.automation

  function addBlockToAutomation() {
    automationStore.actions.addBlockToAutomation({
      ...blockDefinition,
      inputs: blockDefinition.inputs || {},
      stepId,
      type: blockType,
    })
    if (stepId === blockDefinitions.TRIGGER["WEBHOOK"].stepId) {
      modal.show()
    }
    analytics.captureEvent("Added Automation Block", {
      name: blockDefinition.name,
    })
  }
</script>

<div
  class="automation-block hoverable"
  on:click={addBlockToAutomation}
  data-cy={stepId}>
  <div><i class={blockDefinition.icon} /></div>
  <div class="automation-text">
    <h4>{blockDefinition.name}</h4>
    <p>{blockDefinition.description}</p>
  </div>
</div>
<Modal bind:this={modal} width="30%">
  <CreateWebookModal />
</Modal>

<style>
  .automation-block {
    display: grid;
    grid-template-columns: 20px auto;
    align-items: center;
    margin-top: var(--spacing-s);
    padding: var(--spacing-m);
    border-radius: var(--border-radius-m);
  }
  .automation-block:hover {
    background-color: var(--grey-1);
  }
  .automation-block:first-child {
    margin-top: 0;
  }

  i {
    color: var(--grey-7);
    font-size: 20px;
  }

  .automation-text {
    margin-left: 16px;
  }
  .automation-text h4 {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
    margin-top: 0;
  }
  .automation-text p {
    font-size: 12px;
    line-height: 1.4;
    color: var(--grey-7);
    margin: 0;
  }
</style>
