<script>
  export let padding = true
</script>

<div class="drawer-contents" class:padding>
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
    overflow-y: auto;
    flex: 1 1 auto;
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
    scrollbar-width: none;
  }
  .padding .sidebar {
    padding: var(--spacing-xl);
  }
  .sidebar::-webkit-scrollbar {
    display: none;
  }
  .main {
    height: 100%;
    overflow: auto;
  }
  .padding .main {
    padding: var(--spacing-xl);
    height: calc(100% - var(--spacing-xl) * 2);
  }
  .main :global(textarea) {
    min-height: 200px;
  }
  .main :global(p) {
    margin: 0;
  }
</style>
