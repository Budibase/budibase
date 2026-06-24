<div class="resource-panel">
  <div class="resource-panel__toolbar">
    <slot name="toolbar" />
  </div>
  <div class="resource-panel__content">
    <slot />
  </div>
</div>

<style>
  .resource-panel {
    width: 100%;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    overflow: hidden;
    background: var(--spectrum-global-color-gray-100);
  }

  .resource-panel__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
    padding: 6px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    flex-wrap: wrap;
  }

  .resource-panel__content {
    background: var(--spectrum-global-color-gray-100);
  }
</style>
