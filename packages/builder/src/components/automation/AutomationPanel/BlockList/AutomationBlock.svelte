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
    margin-top: 16px;
    padding: 12px;
    border-radius: var(--border-radius-m);
  }

  .automation-block:hover {
    background-color: var(--grey-1);
  }

  .automation-text {
    margin-left: 16px;
  }

  .icon {
    height: 40px;
    width: 40px;
    background: var(--blue-light);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  i {
    color: var(--grey-7);
    font-size: 20px;
  }

  h4 {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
    margin-top: 0;
  }

  p {
    font-size: 12px;
    color: var(--grey-7);
    margin: 0;
  }
</style>
