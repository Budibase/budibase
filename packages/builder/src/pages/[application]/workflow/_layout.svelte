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
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr) 300px;
    background: var(--grey-1);
    line-height: 1;
  }

  .content {
    flex: 1 1 auto;
    margin: 20px 40px;
  }

  .nav {
    overflow: auto;
    width: 300px;
    background: var(--white);
  }

  .inner {
    padding: 20px;
  }
</style>
