<!-- routify:options index=3 -->
<script>
  import { automationStore } from "builderStore"
  import { AutomationPanel, SetupPanel } from "components/automation"
</script>

<div class="root">
  <div class="nav">
    <div class="inner">
      <AutomationPanel />
    </div>
  </div>
  <div class="content">
    <slot />
  </div>
  {#if $automationStore.selectedAutomation}
    <div class="nav">
      <div class="inner">
        <SetupPanel />
      </div>
    </div>
  {/if}
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
