<script>
  import { automationStore } from "builderStore"

  export let blockDefinition
  export let stepId
  export let blockType

  function addBlockToAutomation() {
    automationStore.actions.addBlockToAutomation({
      ...blockDefinition,
      inputs: blockDefinition.inputs || {},
      stepId,
      type: blockType,
    })
  }
</script>

<div
  class="automation-block hoverable"
  on:click={addBlockToAutomation}
  data-cy={stepId}>
  <div>
    <i class={blockDefinition.icon} />
  </div>
  <div class="automation-text">
    <h4>{blockDefinition.name}</h4>
    <p>{blockDefinition.description}</p>
  </div>
</div>

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
    color: var(--grey-7);
    margin: 0;
  }
</style>
