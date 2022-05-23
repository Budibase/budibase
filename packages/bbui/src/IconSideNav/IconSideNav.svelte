<div class="icon-side-nav">
  <slot />
</div>

<style>
  .icon-side-nav {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: var(--spacing-s);
    gap: var(--spacing-xs);
  }
</style>
