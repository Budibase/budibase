<div class="drawer-contents">
  <div class="container" data-cy="binding-dropdown-modal">
    <div class="sidebar">
      <slot name="sidebar" />
    </div>
    <div class="main">
      <slot name="main" />
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
    grid-template-columns: 290px 1fr;
  }
  .sidebar {
    border-right: var(--border-light);
    padding: var(--spacing-l);
    overflow: auto;
  }

  .sidebar::-webkit-scrollbar {
    display: none;
  }

  .main {
    padding: var(--spacing-l);
    font-family: var(--font-sans);
  }
  .main :global(textarea) {
    min-height: 200px;
  }
  .main :global(p) {
    margin: 0;
  }
</style>
