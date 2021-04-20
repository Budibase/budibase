<script>
  import { automationStore } from "builderStore"
  import AutomationPanel from "components/automation/AutomationPanel/AutomationPanel.svelte"
  import SetupPanel from "components/automation/SetupPanel/SetupPanel.svelte"
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
    <div class="nav setup">
      <SetupPanel />
    </div>
  {/if}
</div>

<style>
  .root {
    height: calc(100% - 60px);
    display: grid;
    grid-template-columns: 260px minmax(510px, 1fr) 260px;
  }

  .nav {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-right: var(--border-light);
  }

  .content {
    position: relative;
    padding: var(--spacing-l) 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    overflow: hidden;
  }
</style>
