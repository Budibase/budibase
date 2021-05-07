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
    <div class="setup">
      <SetupPanel />
    </div>
  {/if}
</div>

<style>
  .root {
    flex: 1 1 auto;
    height: 0;
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
    background-color: var(--background);
    padding-bottom: 60px;
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

  .setup {
    padding: var(--spectrum-global-dimension-size-200);
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-l);
    background-color: var(--background);
  }
</style>
