<div class="dropdown-container" on:click>
  <slot />
</div>

<style>
  .dropdown-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: var(--spacing-s) 0;
  }
</style>
