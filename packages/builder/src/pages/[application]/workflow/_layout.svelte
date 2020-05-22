<script>
  import { workflowStore } from "builderStore"
  import { WorkflowList } from "./WorkflowList"
  import { BlockPanel } from "./BlockPanel"
</script>

<div class="root">
  <div class="nav">
    <WorkflowList />
  </div>
  <div class="content">
    <slot />
  </div>
  <div class="nav">
    {#if $workflowStore.selectedWorkflowId}
      <BlockPanel />
    {/if}
  </div>
</div>

<style>
  .content {
    position: relative;
    background: var(--background);
  }

  .nav {
    padding: 20px;
  }

  .root {
    height: 100%;
    display: flex;
    background: #fafafa;
  }

  .content {
    flex: 1 1 auto;
    margin: 20px 40px;
  }

  .nav {
    overflow: auto;
    flex: 0 1 auto;
    width: 275px;
    height: 100%;
    border: 1px solid var(--medium-grey);
    background: var(--white);
  }
</style>
