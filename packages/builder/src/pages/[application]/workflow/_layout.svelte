<script>
  import { workflowStore } from "builderStore"
  import { WorkflowPanel, SetupPanel } from "components/workflow"
</script>

<div class="root">
  <div class="nav">
    <div class="inner">
      <WorkflowPanel />
    </div>
  </div>
  <div class="content">
    <slot />
  </div>
  <div class="nav">
    <div class="inner">
      <SetupPanel />
    </div>
  </div>
</div>

<style>
  .content {
    position: relative;
    background: var(--grey-1);
  }

  .root {
    height: 100%;
    display: flex;
    background: var(--grey-1);
  }

  .content {
    flex: 1 1 auto;
    margin: 20px 40px;
  }

  .nav {
    overflow: auto;
    width: 300px;
    border-right: 1px solid var(--grey-2);
    background: var(--white);
  }

  .inner {
    padding: 20px;
  }
</style>
