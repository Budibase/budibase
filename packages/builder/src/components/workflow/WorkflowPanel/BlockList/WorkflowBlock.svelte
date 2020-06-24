<script>
  import { workflowStore } from "builderStore"

  export let blockType
  export let blockDefinition
  export let actionId

  function addBlockToWorkflow() {
    workflowStore.actions.addBlockToWorkflow({
      ...blockDefinition,
      args: blockDefinition.args || {},
      actionId,
      type: blockType,
    })
  }
</script>

<div
  class="workflow-block hoverable"
  on:click={addBlockToWorkflow}
  data-cy={actionId}>
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
    display: grid;
    grid-template-columns: 40px auto;
    align-items: center;
    margin-top: 16px;
    padding: 16px 0px;
    border-radius: var(--border);
  }

  .workflow-block:hover {
    background-color: var(--grey-1);
  }

  .workflow-text {
    margin-left: 12px;
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
  }

  p {
    font-size: 12px;
    color: var(--grey-7);
    margin: 0;
  }
</style>
