<script>
  import { workflowStore } from "builderStore";

  export let blockType
  export let blockDefinition

  function addBlockToWorkflow() {
    // TODO: store the block type in the DB as well
    workflowStore.actions.addBlockToWorkflow({ blockDefinition, blockType });
  }
</script>

<div class="workflow-block hoverable" on:click={addBlockToWorkflow}>
  <div>
    <i class={blockDefinition.icon} />
  </div>
  <div class="workflow-text">
    <h4>{blockDefinition.name}</h4>
    <p>{blockDefinition.description}</p>
  </div>
</div>

<style>
  .workflow-block {
    display: flex;
    padding: 20px;
    align-items: center;
  }

  .workflow-text {
    margin-left: 10px;
  }

  i {
    background: var(--secondary);
    color: var(--dark-grey);
    padding: 10px;
  }

  h4 {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  p {
    font-size: 12px;
    color: var(--dark-grey);
    margin: 0;
  }
</style>
