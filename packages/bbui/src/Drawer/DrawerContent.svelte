<div class="drawer-contents">
  <div class:no-sidebar={!$$slots.sidebar} class="container">
    {#if $$slots.sidebar}
      <div class="sidebar">
        <slot name="sidebar" />
      </div>
    {/if}
    <div class="main">
      <slot />
    </div>
  </div>
</div>

<style>
  .drawer-contents {
    height: 40vh;
    overflow-y: auto;
  }
  .container {
    height: 100%;
    display: grid;
    grid-template-columns: 320px 1fr;
  }
  .no-sidebar {
    grid-template-columns: 1fr;
  }
  .sidebar {
    border-right: var(--border-light);
    overflow: auto;
    padding: var(--spacing-xl);
    scrollbar-width: none;
  }
  .sidebar::-webkit-scrollbar {
    display: none;
  }
  .main {
    padding: var(--spacing-xl);
  }
  .main :global(textarea) {
    min-height: 200px;
  }
  .main :global(p) {
    margin: 0;
  }
</style>
