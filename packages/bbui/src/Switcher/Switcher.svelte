<script>
</script>

<div class="view-mode-toggle">
  <div class="group">
    <slot name="left" />
    <slot name="right" />
  </div>
</div>

<style>
  .view-mode-toggle {
    display: flex;
    gap: var(--spacing-l);
    flex-shrink: 0;
  }
  .view-mode-toggle .group {
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    background: var(--spectrum-global-color-gray-100);
    padding: 2px;
    border: 1px solid var(--spectrum-global-color-gray-300);
  }
  .view-mode-toggle .group :global(> *:not(:first-child)) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }
  .view-mode-toggle .group :global(> *:not(:last-child)) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
