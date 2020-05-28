<script>
  import { workflowStore } from "builderStore"
  import { WorkflowPanel } from "./WorkflowPanel"
  import { SetupPanel } from "./SetupPanel"
</script>

<div class="root">
  <div class="nav">
    <WorkflowPanel />
  </div>
  <div class="content">
    <slot />
  </div>
  <div class="nav">
    <SetupPanel />
  </div>
</div>

<style>
  .content {
    position: relative;
    background: var(--background);
  }

  .nav {
    padding: 20px;
    height: 100%;
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
