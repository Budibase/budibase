<script>
  import { automationStore } from "builderStore"
  import { AutomationPanel, SetupPanel } from "components/automation"
</script>

<!-- routify:options index=3 -->
<div class="root">
  <div class="nav">
    <AutomationPanel />
  </div>
  <div class="content">
    <slot />
  </div>
  {#if $automationStore.selectedAutomation}
    <div class="nav">
      <SetupPanel />
    </div>
  {/if}
</div>

<style>
  .content {
    position: relative;
  }

  .root {
    height: calc(100% - 60px);
    display: grid;
    grid-template-columns: 300px minmax(510px, 1fr) 300px;
    background: var(--grey-1);
    line-height: 1;
  }

  .nav {
    overflow-y: auto;
    background: var(--white);
    padding: var(--spacing-xl) var(--spacing-xl);
  }
</style>
